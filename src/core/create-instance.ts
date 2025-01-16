import { createUrl } from 'src/utils/create-url';

import { mergeConfigs } from '../utils/merge-configs';

import { Fwrp } from './fwrp';
import { methods } from './constants';

import type { FwprPromiseResponse, FwrpConfigs } from '../types/fwrp';

export type InitConfigs = Omit<FwrpConfigs, 'method'>;

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
};

export const createInstance = (
	prefixUrl?: string,
	defaultConfigs?: InitConfigs,
): FwrpInstance => {
	const fwrp = {} as FwrpInstance;

	for (const method of methods) {
		fwrp[method as keyof FwrpInstance] = (
			url: string,
			bodyOrConfigs?: InitConfigs | unknown,
			configs?: InitConfigs,
		) => {
			const withBody = ['post', 'put'].includes(method);

			console.log('aqui', prefixUrl);
			console.log('aqui', url);

			const urlNormalized = prefixUrl
				? createUrl(prefixUrl, url)
				: createUrl(url);

			console.log(urlNormalized);

			/**
			 * create instance without body
			 */
			if (!withBody) {
				const newConfig: FwrpConfigs = bodyOrConfigs || {};
				newConfig.method = method.toUpperCase();

				return Fwrp.create(
					urlNormalized.toString(),
					mergeConfigs(newConfig, defaultConfigs),
				);
			}

			const newConfig: FwrpConfigs = configs || {};
			newConfig.method = method.toUpperCase();

			if (bodyOrConfigs) {
				newConfig.body = JSON.stringify(bodyOrConfigs);
				newConfig.headers = {
					'Content-Type': 'application/json',
				};
			}

			return Fwrp.create(
				urlNormalized.toString(),
				mergeConfigs(newConfig, defaultConfigs),
			);
		};
	}

	return fwrp;
};
