import { CreateURL } from '../utils/create-url';
import { mergeConfigs } from '../utils/merge-configs';

import { Fwrp } from './fwrp';

import type { FwprPromiseResponse, FwrpConfigs } from '../types/fwrp';

export type InitConfigs = Omit<FwrpConfigs, 'method' | 'body'>;
export type RequestInitConfigs = InitConfigs & {
	url: string;
	body?: unknown;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
};

export type FwrpInstance = {
	get: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	post: <B = unknown, T = unknown>(
		url: string,
		body?: B,
		configs?: InitConfigs,
	) => FwprPromiseResponse<T>;
	put: <B = unknown, T = unknown>(
		url: string,
		body?: B,
		configs?: InitConfigs,
	) => FwprPromiseResponse<T>;
	delete: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	patch: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	head: <T>(url: string, configs?: InitConfigs) => FwprPromiseResponse<T>;
	fetch: <T>(configs: RequestInitConfigs) => FwprPromiseResponse<T>;
};

export const createInstance = (
	prefixUrl?: string,
	defaultConfigs?: InitConfigs,
): FwrpInstance => {
	const fwrp = {} as FwrpInstance;

	fwrp.fetch = (configs: RequestInitConfigs) => {
		const urlInstance = prefixUrl
			? CreateURL.create(prefixUrl, configs.url)
			: CreateURL.create(configs.url);

		return Fwrp.create(urlInstance, mergeConfigs(configs, defaultConfigs));
	};

	fwrp.get = <T>(url: string, configs?: InitConfigs): FwprPromiseResponse<T> =>
		fwrp.fetch({ ...configs, method: 'GET', url });

	fwrp.patch = <T>(
		url: string,
		configs?: InitConfigs,
	): FwprPromiseResponse<T> => fwrp.fetch({ ...configs, method: 'PATCH', url });

	fwrp.head = <T>(url: string, configs?: InitConfigs): FwprPromiseResponse<T> =>
		fwrp.fetch({ ...configs, method: 'HEAD', url });

	fwrp.post = <B = unknown, T = unknown>(
		url: string,
		body?: B,
		configs?: InitConfigs,
	): FwprPromiseResponse<T> =>
		fwrp.fetch({ ...configs, method: 'POST', url, body });

	fwrp.put = <B = unknown, T = unknown>(
		url: string,
		body?: B,
		configs?: InitConfigs,
	): FwprPromiseResponse<T> =>
		fwrp.fetch({ ...configs, method: 'PUT', url, body });

	fwrp.delete = <T>(
		url: string,
		configs?: InitConfigs,
	): FwprPromiseResponse<T> =>
		fwrp.fetch({ ...configs, method: 'DELETE', url });

	return fwrp;
};
