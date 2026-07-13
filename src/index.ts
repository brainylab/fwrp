import type { InitConfigs } from "./core/create-instance";
import { createInstance, type FwrpInstance } from "./core/create-instance";
import {
	type ErrorHandlingResponse,
	fwrpErrorHandling,
} from "./core/error-handling";

const fwrp = createInstance() as FwrpInstance & {
	create: (url?: string, configs?: InitConfigs) => FwrpInstance;
	errorHandling: (error: unknown) => ErrorHandlingResponse<unknown>;
};

fwrp.create = createInstance;
fwrp.errorHandling = fwrpErrorHandling;

/**
 * export types
 */
export type { FwrpInstance } from "./core/create-instance";
export * from "./core/error-handling";
/**
 * export lib
 */
export * from "./errors/http-request-error";
export type * from "./types";
export type * from "./types/fwrp";

export { fwrp, fwrp as default };
