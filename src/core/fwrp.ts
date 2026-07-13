import type {
  FwprPromiseResponse,
  FwrpConfigs,
  FwrpHooks,
} from "../types/fwrp";
import type { CreateURL } from "../utils/create-url";
import type { ObjectEntries } from "../utils/types";

import { HttpRequestError } from "../errors/http-request-error";
import { mergeConfigs } from "../utils/merge-configs";
import { responseTypes } from "./constants";

type InternalOptions = {
  json?: unknown;
  fetch: typeof globalThis.fetch;
  headers:
    | NonNullable<RequestInit["headers"]>
    | Record<string, string | undefined>;
} & Omit<FwrpConfigs, "headers">;

type InternalTransform = (
  data: any,
  response: Response,
) => unknown | Promise<unknown>;

export class Fwrp {
  public request: Request;
  public hooks: FwrpHooks = {
    beforeRequest: undefined,
    beforeError: undefined,
    afterResponse: undefined,
  };

  public transforms: InternalTransform[] = [];

  private _configs: InternalOptions;

  constructor(url: string, configs: FwrpConfigs) {
    this._configs = {
      ...configs,
      throwHttpError: configs?.throwHttpError ?? true,
      fetch: globalThis.fetch.bind(globalThis),
    } as InternalOptions;

    if (configs?.hooks) {
      this.hooks = configs.hooks;
    }

    this.request = new globalThis.Request(url, this._configs as RequestInit);
  }

  protected async _fetch(): Promise<Response> {
    /**
     * implement befor request hook
     */
    if (this.hooks?.beforeRequest) {
      await this.hooks.beforeRequest(this.request);
    }

    const fetch = await this._configs.fetch(this.request);

    /**
     * implement after response hook
     */
    if (this.hooks?.afterResponse) {
      await this.hooks.afterResponse(fetch);
    }

    return fetch;
  }

  static create(url: CreateURL, configs: FwrpConfigs) {
    if (configs?.params) {
      url.addParams(configs.params);
    }

    if (typeof configs.body === "object") {
      configs.body = JSON.stringify(configs.body);
      configs.headers = mergeConfigs(
        {
          "Content-Type": "application/json",
        },
        configs.headers,
      ) as Record<string, string>;
    }

    const fwrp = new Fwrp(url.toString(), configs);

    const handler = async (): Promise<Response> => {
      const response = await fwrp._fetch();

      if (!response.ok && fwrp._configs.throwHttpError) {
        const _cloneResponse = response.clone();
        const error = new HttpRequestError(_cloneResponse, fwrp.request);

        if (configs.hooks?.beforeError) {
          await configs.hooks.beforeError(error);
        }

        throw new HttpRequestError(response, fwrp.request);
      }

      return response;
    };

    const result = handler() as FwprPromiseResponse<unknown>;

    for (const [type, mimeType] of Object.entries(
      responseTypes,
    ) as ObjectEntries<typeof responseTypes>) {
      result[type] = async (): Promise<any> => {
        if (type === "request") {
          return fwrp.request;
        }

        fwrp.request.headers.set(
          "accept",
          fwrp.request.headers.get("accept") || mimeType,
        );

        const response = await result;

        if (type === "json") {
          if (response.status === 204) {
            return "";
          }

          const arrayBuffer = await response.clone().arrayBuffer();
          const responseSize = arrayBuffer.byteLength;
          if (responseSize === 0) {
            return "";
          }

          let data = await response.json();

          for (const transform of fwrp.transforms) {
            const transformed = await transform(data, response);

            if (transformed === undefined) {
              continue;
            }

            if (
              data &&
              typeof data === "object" &&
              transformed &&
              typeof transformed === "object"
            ) {
              data = { ...data, ...transformed };
            } else {
              data = transformed;
            }
          }

          return data;
        }

        return response[type]();
      };
    }

    result.transform = ((fn: InternalTransform) => {
      fwrp.transforms.push(fn);
      return result;
    }) as FwprPromiseResponse<unknown>["transform"];

    return result;
  }
}
