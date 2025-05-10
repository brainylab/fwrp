import { HttpRequestError } from '../errors/http-request-error';

import { responseTypes } from './constants';

import type { CreateURL } from '../utils/create-url';
import type {
	FwprPromiseResponse,
	FwrpConfigs,
	FwrpHooks,
} from '../types/fwrp';
import type { ObjectEntries } from '../utils/types';

type InternalOptions = {
	json?: unknown;
	fetch: typeof globalThis.fetch;
	headers:
		| NonNullable<RequestInit['headers']>
		| Record<string, string | undefined>;
} & Omit<FwrpConfigs, 'headers'>;

export class Fwrp {
	public request: Request;
	public hooks: FwrpHooks = {
		beforeRequest: undefined,
		beforeError: undefined,
	};

	private _configs: InternalOptions;

	constructor(url: string, configs: FwrpConfigs) {
		this._configs = {
			...configs,
			fetch: globalThis.fetch.bind(globalThis),
		} as InternalOptions;

		if (configs?.hooks) {
			this.hooks = configs.hooks;
		}

		this.request = new globalThis.Request(url, this._configs as RequestInit);
	}

	protected async _fetch(): Promise<Response> {
		/**
		 * implement before hook
		 */
		if (this.hooks?.beforeRequest) {
			await this.hooks.beforeRequest(this.request);
		}

		const fetch = await this._configs.fetch(this.request);

		return fetch;
	}

	static create(url: CreateURL, configs: FwrpConfigs) {
		if (configs?.params) {
			url.addParams(configs.params);
		}

		const fwrp = new Fwrp(url.toString(), configs);

		const handler = async (): Promise<Response> => {
			await Promise.resolve();
			const response = await fwrp._fetch();

			if (!response.ok) {
				if (configs.hooks?.beforeError) {
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
			result[type] = async () => {
				if (type === 'request') {
					return fwrp.request;
				}

				fwrp.request.headers.set(
					'accept',
					fwrp.request.headers.get('accept') || mimeType,
				);

				const response = await result;

				if (type === 'json') {
					if (response.status === 204) {
						return '';
					}

					const arrayBuffer = await response.clone().arrayBuffer();
					const responseSize = arrayBuffer.byteLength;
					if (responseSize === 0) {
						return '';
					}
				}

				return response[type]();
			};
		}

		return result;
	}
}
