import type { HttpRequestError } from '../errors/http-request-error';
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
	beforeRequest?: (request: Request) => Promise<void>;
	beforeError?: (error: HttpRequestError) => Promise<void>;
};

export type FwrpHeadersInit =
	| NonNullable<RequestInit['headers']>
	| Record<string, string | undefined>;

export type FwrpConfigs = RequestInit & {
	params?: ObjectToUrl;
	headers?: FwrpHeadersInit & { Authorization?: string };
	hooks?: FwrpHooks;
	throwHttpError?: boolean;
};
