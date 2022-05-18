import type { AnyAbility } from "@casl/ability";
import type { Id, Service } from "@feathersjs/feathers";
import type { UtilCheckCanOptions } from "../types";
declare const checkCan: <S>(ability: AnyAbility, id: Id, method: string, modelName: string, service: Service<S, Partial<S>, import("@feathersjs/feathers").Params<import("@feathersjs/feathers").Query>>, providedOptions?: Partial<UtilCheckCanOptions>) => Promise<boolean>;
export default checkCan;
