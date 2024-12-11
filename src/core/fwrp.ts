import { mergeConfigs } from '../utils/merge-configs';
import { objectToUrlParams } from '../utils/object-to-url-params';
import { HttpRequestError } from '../errors/http-request-error';

import { responseTypes } from './constants';

import type {
	FwprPromiseResponse,
	FwrpConfigs,
	FwrpHooks,
} from '../types/fwrp';
import type { ObjectEntries } from '../utils/types';

type InternalOptions = {
	fetch: typeof globalThis.fetch;
};

export class Fwrp {
	public request: Request;
	public hooks: FwrpHooks = {
		afterRequest: undefined,
		beforeError: undefined,
	};
	protected _options: InternalOptions;

	private _configs: FwrpConfigs;

	constructor(url: string, configs: FwrpConfigs) {
		this._configs = mergeConfigs({ headers: {} }, configs);

		this.request = new globalThis.Request(url, this._configs);

		if (configs?.hooks) {
			this.hooks = configs.hooks;
		}

		this._options = {
			fetch: globalThis.fetch.bind(globalThis),
		};
	}

	protected async _fetch(): Promise<Response> {
		/**
		 * implement before hook
		 */
		if (this.hooks?.afterRequest) {
			await this.hooks.afterRequest(this.request);
		}

		const fetch = await this._options.fetch(this.request);

		return fetch;
	}

	static create(input: string, configs: FwrpConfigs) {
		/**
		 * create a new URL instance with params
		 */
		const url = new URL(input);

		if (configs?.params) {
			const params = objectToUrlParams(configs.params);
			url.search = params;
		}

		if (configs?.params) {
			const params = objectToUrlParams(configs.params);
			url.search = params;
		}
		// end of create url

		const fwrp = new Fwrp(url.toString(), configs);

		const handler = async (): Promise<Response> => {
			const response = await fwrp._fetch();

			if (!response.ok) {
				if (configs.hooks?.beforeError) {
					console.log('aqui');
					await configs.hooks.beforeError(response);
				}

				throw new HttpRequestError(response, fwrp.request);
			}

			return response;
		};

		const result = handler() as FwprPromiseResponse<unknown>;

		for (const [type, mimeType] of Object.entries(
			responseTypes,
		) as ObjectEntries<typeof responseTypes>) {
			(result as any)[type] = async () => {
				if (type === 'request') {
					return fwrp.request;
				}

				// fwrp.request.headers.set(
				// 	'accept',
				// 	fwrp.request.headers.get('accept') || mimeType,
				// );

				if (!fwrp.request.headers.has('accept')) {
					fwrp.request.headers.set('accept', mimeType);
				}

				const response = await result;

				if (type === 'json') {
					if (response.status === 204) {
						return '';
					}

					// const arrayBuffer = await response.clone().arrayBuffer();
					// const responseSize = arrayBuffer.byteLength;
					// if (responseSize === 0) {
					// 	return '';
					// }

					return response[type]();
				}
			};
		}

		return result;
	}
}
