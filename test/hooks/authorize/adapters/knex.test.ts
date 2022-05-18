import knex from "knex";
import makeTests from "./makeTests";
import { Service } from "feathers-knex";
import { getItems } from "feathers-hooks-common";
import path from "path";
import { ServiceCaslOptions } from "../../../../lib/types";
import { HookContext } from "@feathersjs/feathers";

const db  = knex({
  client: "sqlite3",
  debug: false,
  connection: {
    filename: path.join(__dirname, "../../../.data/db.sqlite")
  },
  useNullAsDefault: true
});
  
// Create the schema
db.schema.createTable("messages", table => {
  table.increments("id");
  table.string("text");
});

declare module "@feathersjs/adapter-commons" {
  interface ServiceOptions {
    casl: ServiceCaslOptions
  }
}

const makeService = () => {
  return new Service({
    Model: db,
    name: "tests",
    multi: true,
    whitelist: ["$not"],
    casl: {
      availableFields: [
        "id", 
        "userId", 
        "hi", 
        "test", 
        "published",
        "supersecret", 
        "hidden"
      ]
    },
    paginate: {
      default: 10,
      max: 50
    }
  });
};

const boolFields = [
  "test",
  "published",
  "supersecret",
  "hidden"
];

const afterHooks = [
  (context: HookContext) => {
    // @ts-ignore
    let items = getItems(context);
    const isArray = Array.isArray(items);
    items = (isArray) ? items : [items];

    const result = items;

    result.forEach((item, i) => {
      const keys = Object.keys(item);
      keys.forEach(key => {
        if (item[key] === null) {
          delete item[key];
          return;
        }
        if (boolFields.includes(key)) {
          item[key] = !!item[key];
        }
      });

      result[i] = { ...item };
    });

    context.result = (isArray) ? result : result[0];
  }
];

makeTests(
  "feathers-knex", 
  makeService, 
  async () => {
    await db.schema.dropTableIfExists("tests");
    await db.schema.createTable("tests", table => {
      table.increments("id");
      table.integer("userId");
      table.string("hi");
      table.boolean("test");
      table.boolean("published");
      table.boolean("supersecret");
      table.boolean("hidden");
    });
  },
  { adapter: "feathers-knex" },
  afterHooks
);