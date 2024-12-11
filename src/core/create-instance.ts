import { createPath } from '../utils/create-path';
import { mergeConfigs } from '../utils/merge-configs';

import { Fwrp } from './fwrp';
import { methods } from './constants';

import type { FwprPromiseResponse, FwrpConfigs } from '../types/fwrp';

export type InitConfigs = Omit<FwrpConfigs, 'method'>;

export type FwrpInstance = {
	get: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	post: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	put: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	delete: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	patch: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	head: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
};

export const createInstance = (
	prefixUrl?: string,
	defaultConfigs?: InitConfigs,
): FwrpInstance => {
	const fwrp = {} as FwrpInstance;

	for (const method of methods) {
		fwrp[method as keyof FwrpInstance] = (
			url: string,
			configs?: InitConfigs,
		) => {
			const urlNormalized = new URL(createPath(url), prefixUrl);

			return Fwrp.create(
				urlNormalized.toString(),
				mergeConfigs(
					{ ...configs, method: method.toUpperCase() },
					defaultConfigs,
				),
			);
		};
	}

	return fwrp;
};
