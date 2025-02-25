import assert from "assert";
import { feathers } from "@feathersjs/feathers";
import { createAliasResolver, defineAbility } from "@casl/ability";

const resolveAction = createAliasResolver({
  update: "patch",
  read: ["get", "find"],
  delete: "remove",
});

import { Application } from "@feathersjs/feathers";

import authorize from "../../../../../lib/hooks/authorize/authorize.hook";
import { Adapter, AuthorizeHookOptions } from "../../../../../lib/types";

export default (
  adapterName: Adapter,
  makeService: () => unknown,
  clean: (app, service) => Promise<void>,
  authorizeHookOptions: Partial<AuthorizeHookOptions>,
  afterHooks?: unknown[]
): void => {
  let app: Application;
  let service;
  let id;

  describe(`${adapterName}: beforeAndAfter - update-data`, function () {
    
    beforeEach(async function () {
      app = feathers();
      app.use(
        "tests",
        makeService()
      );
      service = app.service("tests");
  
      // eslint-disable-next-line prefer-destructuring
      id = service.options.id;
  
      const options = Object.assign({
        availableFields: [id, "userId", "hi", "test", "published", "supersecret", "hidden"] 
      }, authorizeHookOptions);
      const allAfterHooks = [];
      if (afterHooks) {
        allAfterHooks.push(...afterHooks);
      }
      allAfterHooks.push(authorize(options));

      service.hooks({
        before: {
          all: [ authorize(options) ],
        },
        after: {
          all: allAfterHooks
        },
      });
  
      await clean(app, service);
    });

    it("passes with general 'update-data' rule", async function() {
      const readMethod = ["read", "get"];
      
      for (const read of readMethod) {
        await clean(app, service);
        const item = await service.create({ test: true, userId: 1 });
        const result = await service.update(item[id], { [id]: item[id], test: false, userId: 1 }, {
          ability: defineAbility((can) => {
            can("update", "tests");
            can("update-data", "tests");
            can(read, "tests");
          }, { resolveAction })
        });
        assert.deepStrictEqual(result, { [id]: item[id], test: false, userId: 1 });
      }
    });

    it("fails with no 'update-data' rule", async function() {
      const readMethod = ["read", "get"];
      
      for (const read of readMethod) {
        await clean(app, service);
        const item = await service.create({ test: true, userId: 1 });
        let rejected = false;
        try {
          await service.update(item[id], { [id]: item[id], test: false, userId: 1 }, {
            ability: defineAbility((can) => {
              can("update", "tests");
              can(read, "tests");
            }, { resolveAction })
          });              
        } catch (err) {
          rejected = true;
        }
        assert.ok(rejected, "rejected");
      }
    });

    it("basic cannot 'update-data'", async function() {
      const readMethod = ["read", "get"];
      
      for (const read of readMethod) {
        await clean(app, service);
        const item = await service.create({ test: true, userId: 1 });
        let rejected = false;
        try {
          await service.update(item[id], { test: false, userId: 1 }, {
            ability: defineAbility((can, cannot) => {
              can("update", "tests");
              can("update-data", "tests");
              cannot("update-data", "tests", { test: false });
              can(read, "tests");
            }, { resolveAction })
          });              
        } catch (err) {
          rejected = true;
        }
        assert.ok(rejected, "rejected");
      }
    });

    it("basic can 'update-data' with fail", async function() {
      const readMethod = ["read", "get"];
      
      for (const read of readMethod) {
        await clean(app, service);
        const item = await service.create({ test: true, userId: 1 });
        try {
          await service.update(item[id], { test: false, userId: 1 }, {
            ability: defineAbility((can) => {
              can("update", "tests");
              can("update-data", "tests");
              can("update-data", "tests", { test: true });
              can(read, "tests");
            }, { resolveAction })
          });
          assert.fail("should not get here");
              
        } catch (err) {
          assert.ok(err, "should get here");
        }
      }
    });

    it("basic can 'update-data'", async function () {
      const readMethod = ["read", "get"];
      
      for (const read of readMethod) {
        await clean(app, service);
        const item = await service.create({ test: true, userId: 1 });
        const UpdatedItem = await service.update(item[id], { test: false, userId: 1 }, {
          ability: defineAbility(can => {
            can("update", "tests");
            can("update-data", "tests");
            can("update-data", "tests", { test: false });
            can(read, "tests");
          }, { resolveAction })
        });
        
        assert.deepStrictEqual(UpdatedItem, { [id]: item[id], test: false, userId: 1 }, `updated item correctly for read: '${read}'`);
      }
    });
  });
};