import type { ObjectToUrl } from '../utils/object-to-url-params';

export type FwrpResponse<T = unknown> = {
	json: <J = T>() => Promise<J>;
} & Response;

export type FwprPromiseResponse<T = unknown> = {
	json: <D = T>() => Promise<D>;
	text: () => Promise<string>;
	request: () => Promise<Request>;
} & Promise<FwrpResponse<T>>;

export type FwrpHooks = {
	afterRequest?: (request: Request) => Promise<void>;
	beforeError?: (response: Response) => Promise<void>;
};

export type FwrpConfigs = RequestInit & {
	params?: ObjectToUrl;
	headers?: HeadersInit & { Authorization?: string };
	hooks?: FwrpHooks;
};
