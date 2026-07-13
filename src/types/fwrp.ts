import type { HttpRequestError } from "../errors/http-request-error";
import type { ObjectToUrl } from "../utils/object-to-url-params";

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
  afterResponse?: (response: Response) => Promise<void>;
};

export type TransformFn<T = any, R = unknown> = (
  data: T,
  response: Response,
) => R | Promise<R>;

export type FwrpHeadersInit =
  | NonNullable<RequestInit["headers"]>
  | Record<string, string | undefined>;

export type FwrpConfigs<T = any, R = unknown> = RequestInit & {
  params?: ObjectToUrl;
  headers?: FwrpHeadersInit & { Authorization?: string };
  hooks?: FwrpHooks;
  transform?: TransformFn<T, R>;
  throwHttpError?: boolean;
};
