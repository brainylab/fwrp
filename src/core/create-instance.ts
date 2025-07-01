import { CreateURL } from '../utils/create-url';
import { mergeConfigs } from '../utils/merge-configs';

import { Fwrp } from './fwrp';
import { methods } from './constants';

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

	for (const method of methods) {
		fwrp[method as keyof FwrpInstance] = (
			urlOrConfig: string | RequestInitConfigs,
			bodyOrConfigs?: InitConfigs | unknown,
			configs?: InitConfigs,
		) => {
			const requestUrl =
				typeof urlOrConfig === 'string' ? urlOrConfig : urlOrConfig.url;
			const requestMethod =
				typeof urlOrConfig === 'string'
					? method
					: urlOrConfig.method.toLowerCase();

			const withBody = ['post', 'put'].includes(requestMethod);

			const urlInstance = prefixUrl
				? CreateURL.create(prefixUrl, requestUrl)
				: CreateURL.create(requestUrl);

			/**
			 * create instance without body
			 */
			if (!withBody) {
				const newConfig: FwrpConfigs = bodyOrConfigs || {};
				newConfig.method = requestMethod.toUpperCase();

				return Fwrp.create(
					urlInstance,
					mergeConfigs(newConfig, defaultConfigs),
				);
			}

			const newConfig: FwrpConfigs = configs || {};
			newConfig.method = requestMethod.toUpperCase();

			if (bodyOrConfigs) {
				newConfig.body = JSON.stringify(bodyOrConfigs);
				newConfig.headers = {
					'Content-Type': 'application/json',
				};
			}

			return Fwrp.create(urlInstance, mergeConfigs(newConfig, defaultConfigs));
		};
	}

	return fwrp;
};
