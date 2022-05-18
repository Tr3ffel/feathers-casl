import type { AnyAbility } from "@casl/ability";
import type { Application, Query, Service } from "@feathersjs/feathers";
import type { AuthorizeHookOptions } from "../types";
export default function mergeQueryFromAbility<T>(app: Application, ability: AnyAbility, method: string, modelName: string, originalQuery: Query, service: Service<T>, options: Pick<AuthorizeHookOptions, "adapter">): Query;
