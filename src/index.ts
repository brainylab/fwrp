import { createInstance, type FwrpInstance } from './core/create-instance';
import {
	fwrpErrorHandling,
	type ErrorHandlingResponse,
} from './core/error-handling';

import type { InitConfigs } from './core/create-instance';

const fwrp = createInstance() as FwrpInstance & {
	create: (url?: string, configs?: InitConfigs) => FwrpInstance;
	errorHandling: (error: unknown) => ErrorHandlingResponse<unknown>;
};

fwrp.create = createInstance;
fwrp.errorHandling = fwrpErrorHandling;

/**
 * export lib
 */
export * from './errors/http-request-error';
export * from './core/error-handling';

/**
 * export types
 */
export type { FwrpInstance } from './core/create-instance';
export type * from './types';

export { fwrp, fwrp as default };
