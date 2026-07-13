import type {
  FwprPromiseResponse,
  FwrpConfigs,
  TransformFn,
} from "../types/fwrp";
import type { Merge } from "../utils/types";

import { CreateURL } from "../utils/create-url";
import { mergeConfigs } from "../utils/merge-configs";
import { Fwrp } from "./fwrp";

export type InitConfigs = Omit<FwrpConfigs, "method" | "body">;
export type RequestInitConfigs = InitConfigs & {
  url: string;
  body?: unknown;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";
};

type ConfigsWithTransform<T, R> = Omit<InitConfigs, "transform"> & {
  transform?: TransformFn<T, R>;
};

export type FwrpInstance = {
  get: <T = any, R = unknown>(
    url: string,
    configs?: ConfigsWithTransform<T, R>,
  ) => FwprPromiseResponse<Merge<T, R>>;

  post: <B = unknown, T = any, R = unknown>(
    url: string,
    body?: B,
    configs?: ConfigsWithTransform<T, R>,
  ) => FwprPromiseResponse<Merge<T, R>>;

  put: <B = unknown, T = any, R = unknown>(
    url: string,
    body?: B,
    configs?: ConfigsWithTransform<T, R>,
  ) => FwprPromiseResponse<Merge<T, R>>;

  delete: <T = any, R = unknown>(
    url: string,
    configs?: ConfigsWithTransform<T, R>,
  ) => FwprPromiseResponse<Merge<T, R>>;

  patch: <T = any, R = unknown>(
    url: string,
    configs?: ConfigsWithTransform<T, R>,
  ) => FwprPromiseResponse<Merge<T, R>>;

  head: <T = any, R = unknown>(
    url: string,
    configs?: ConfigsWithTransform<T, R>,
  ) => FwprPromiseResponse<Merge<T, R>>;

  fetch: <T = unknown>(configs: RequestInitConfigs) => FwprPromiseResponse<T>;
};

export const createInstance = (
  prefixUrl?: string,
  defaultConfigs?: InitConfigs,
): FwrpInstance => {
  const fwrp = {} as FwrpInstance;

  fwrp.fetch = ((configs: RequestInitConfigs) => {
    const urlInstance = prefixUrl
      ? CreateURL.create(prefixUrl, configs.url)
      : CreateURL.create(configs.url);

    return Fwrp.create(urlInstance, mergeConfigs(configs, defaultConfigs));
  }) as FwrpInstance["fetch"];

  fwrp.get = ((url: string, configs?: InitConfigs) =>
    fwrp.fetch({ ...configs, method: "GET", url })) as FwrpInstance["get"];

  fwrp.patch = ((url: string, configs?: InitConfigs) =>
    fwrp.fetch({ ...configs, method: "PATCH", url })) as FwrpInstance["patch"];

  fwrp.head = ((url: string, configs?: InitConfigs) =>
    fwrp.fetch({ ...configs, method: "HEAD", url })) as FwrpInstance["head"];

  fwrp.post = ((url: string, body?: unknown, configs?: InitConfigs) =>
    fwrp.fetch({
      ...configs,
      method: "POST",
      url,
      body,
    })) as FwrpInstance["post"];

  fwrp.put = ((url: string, body?: unknown, configs?: InitConfigs) =>
    fwrp.fetch({
      ...configs,
      method: "PUT",
      url,
      body,
    })) as FwrpInstance["put"];

  fwrp.delete = ((url: string, configs?: InitConfigs) =>
    fwrp.fetch({
      ...configs,
      method: "DELETE",
      url,
    })) as FwrpInstance["delete"];

  return fwrp;
};
