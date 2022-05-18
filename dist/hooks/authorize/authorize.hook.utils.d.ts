import type { AnyAbility } from "@casl/ability";
import type { Application, HookContext, Params } from "@feathersjs/feathers";
import type { Adapter, AuthorizeHookOptions, HookBaseOptions, Path, ThrowUnlessCanOptions } from "../../types";
import { Promisable } from "type-fest";
export declare const makeOptions: (app: Application, options?: Partial<AuthorizeHookOptions>) => AuthorizeHookOptions;
export declare const makeDefaultOptions: (options?: Partial<AuthorizeHookOptions>) => AuthorizeHookOptions;
export declare const getAdapter: (app: Application, options: Pick<AuthorizeHookOptions, "adapter">) => Adapter;
export declare const getAbility: (context: HookContext, options?: Pick<HookBaseOptions, "ability" | "checkAbilityForInternal">) => Promise<AnyAbility | undefined>;
export declare const throwUnlessCan: (ability: AnyAbility, method: string, resource: string | Record<string, unknown>, modelName: string, options: Partial<ThrowUnlessCanOptions>) => boolean;
export declare const refetchItems: (context: HookContext, params?: Params) => Promise<unknown[] | undefined>;
export declare const getConditionalSelect: ($select: string[], ability: AnyAbility, method: string, modelName: string) => undefined | string[];
export declare const checkMulti: (context: HookContext, ability: AnyAbility, modelName: string, options?: Pick<AuthorizeHookOptions, "actionOnForbidden">) => boolean;
export declare const setPersistedConfig: (context: HookContext, key: Path, val: unknown) => HookContext;
export declare function getPersistedConfig(context: HookContext, key: "ability"): AnyAbility | ((context: HookContext) => Promisable<AnyAbility | undefined>) | undefined;
export declare function getPersistedConfig(context: HookContext, key: "skipRestrictingRead.conditions"): boolean;
export declare function getPersistedConfig(context: HookContext, key: "skipRestrictingRead.fields"): boolean;
export declare function getPersistedConfig(context: HookContext, key: "madeBasicCheck"): boolean;
