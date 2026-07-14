import type { HttpRequestError } from "../errors/http-request-error";
import type { ObjectToUrl } from "../utils/object-to-url-params";
import type { TransformMerge } from "../utils/types";

export type FwrpResponse<T = unknown> = {
  json: <J = T>() => Promise<J>;
  transform: <R>(
    fn: (data: T, response: Response) => R | Promise<R>,
  ) => FwrpResponse<TransformMerge<T, R>>;
} & Response;

export type FwprPromiseResponse<T = unknown> = {
  json: <D = T>() => Promise<D>;
  text: () => Promise<string>;
  request: () => Promise<Request>;
  transform: <R>(
    fn: (data: T, response: Response) => R | Promise<R>,
  ) => FwprPromiseResponse<TransformMerge<T, R>>;
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

export type FwrpConfigs = RequestInit & {
  params?: ObjectToUrl;
  headers?: FwrpHeadersInit & { Authorization?: string };
  hooks?: FwrpHooks;
  throwHttpError?: boolean;
};
