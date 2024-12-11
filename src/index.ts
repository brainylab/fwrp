import { createInstance, type FwrpInstance } from './core/create-instance';
import {
	fwprErrorHandling,
	type ErrorHandlingResponse,
} from './core/error-handling';

import type { InitConfigs } from './core/create-instance';

const fwrp = createInstance() as FwrpInstance & {
	create: (url?: string, configs?: InitConfigs) => FwrpInstance;
	errorHandling: (error: unknown) => ErrorHandlingResponse;
};

fwrp.create = createInstance;
fwrp.errorHandling = fwprErrorHandling;

/**
 * export lib
 */
export * from './errors/http-request-error';
export * from './core/error-handling';

export { fwrp, fwrp as default };
