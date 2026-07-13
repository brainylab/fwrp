import { HttpRequestError } from "../errors/http-request-error";
import { CreateURL } from "../utils/create-url";
import { Fwrp } from "./fwrp";

const BASE_URL = "https://api.example.com/resource";

function jsonResponse(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    statusText: "OK",
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function mockFetch(response: Response | Error) {
  return vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
    if (response instanceof Error) {
      throw response;
    }
    return response;
  });
}

/** Retrieves the Request that was actually sent to fetch. */
function sentRequest(spy: ReturnType<typeof mockFetch>): Request {
  return spy.mock.calls[0][0] as Request;
}

describe("Fwrp", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("basic request", () => {
    it("should make a GET request and resolve the Response", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      const { status, statusText } = await response;
      const data = await response.json<{ cep: string }>();

      expect(status).toBe(200);
      expect(statusText).toBe("OK");
      expect(data).toEqual({ cep: "89010025" });
    });

    it("should send the correct method and URL to fetch", async () => {
      const spy = mockFetch(jsonResponse({ ok: true }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });
      await response.json();

      const request = sentRequest(spy);
      expect(request.method).toBe("GET");
      expect(request.url).toBe(BASE_URL);
    });

    it("should append query params to the URL", async () => {
      const spy = mockFetch(jsonResponse({ ok: true }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        params: { page: 1, tags: ["a", "b"] },
      });
      await response.json();

      const request = sentRequest(spy);
      expect(request.url).toContain("page=1");
      expect(request.url).toContain("tags=a");
      expect(request.url).toContain("tags=b");
    });
  });

  describe("request body", () => {
    it("should serialize object body and set Content-Type application/json", async () => {
      const spy = mockFetch(jsonResponse({ id: 1 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "POST",
        body: { name: "fwrp" } as unknown as BodyInit,
      });
      await response.json();

      const request = sentRequest(spy);
      expect(request.headers.get("content-type")).toBe("application/json");
      await expect(request.text()).resolves.toBe(
        JSON.stringify({ name: "fwrp" }),
      );
    });

    it("should not change Content-Type when the body is not an object", async () => {
      const spy = mockFetch(jsonResponse({ id: 1 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "POST",
        body: "raw-string",
      });
      await response.json();

      const request = sentRequest(spy);
      expect(request.headers.get("content-type")).not.toBe("application/json");
    });
  });

  describe("HTTP error handling", () => {
    it("should throw HttpRequestError by default on a non-ok response", async () => {
      mockFetch(jsonResponse({ error: "not found" }, { status: 404 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      await expect(response).rejects.toBeInstanceOf(HttpRequestError);
    });

    it("should not throw when throwHttpError is false", async () => {
      mockFetch(jsonResponse({ error: "not found" }, { status: 404 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        throwHttpError: false,
      });

      const resolved = await response;
      expect(resolved.status).toBe(404);
      expect(resolved.ok).toBe(false);
    });

    it("should propagate network errors (e.g. connection refused)", async () => {
      mockFetch(new TypeError("fetch failed"));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      await expect(response.json()).rejects.toBeInstanceOf(TypeError);
    });
  });

  describe("hooks", () => {
    it("should run beforeRequest and mutate the request", async () => {
      const spy = mockFetch(jsonResponse({ ok: true }));
      const beforeRequest = vi.fn(async (request: Request) => {
        request.headers.set("x-custom-header", "custom-value");
      });

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        hooks: { beforeRequest },
      });
      await response.json();

      expect(beforeRequest).toHaveBeenCalledTimes(1);
      expect(sentRequest(spy).headers.get("x-custom-header")).toBe(
        "custom-value",
      );
    });

    it("should run afterResponse with the Response", async () => {
      mockFetch(jsonResponse({ ok: true }));
      const afterResponse = vi.fn(async (_response: Response) => {});

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        hooks: { afterResponse },
      });
      await response.json();

      expect(afterResponse).toHaveBeenCalledTimes(1);
      expect(afterResponse.mock.calls[0][0]).toBeInstanceOf(Response);
    });

    it("should run beforeError with the HttpRequestError before throwing", async () => {
      mockFetch(jsonResponse({ error: "boom" }, { status: 500 }));
      const beforeError = vi.fn(async (_error: HttpRequestError) => {});

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        hooks: { beforeError },
      });

      await expect(response).rejects.toBeInstanceOf(HttpRequestError);
      expect(beforeError).toHaveBeenCalledTimes(1);
      expect(beforeError.mock.calls[0][0]).toBeInstanceOf(HttpRequestError);
    });

    it("should propagate an error thrown inside beforeRequest", async () => {
      mockFetch(jsonResponse({ ok: true }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        hooks: {
          beforeRequest: async () => {
            throw new Error("intercept error");
          },
        },
      });

      await expect(response.json()).rejects.toThrow("intercept error");
    });
  });

  describe("response types", () => {
    it("request() should return the Request without triggering parsing", async () => {
      mockFetch(jsonResponse({ ok: true }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      const request = await response.request();
      expect(request).toBeInstanceOf(Request);
      expect(request.method).toBe("GET");
    });

    it("text() should return the body as a string and set accept text/*", async () => {
      const spy = mockFetch(new Response("plain body", { status: 200 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      const text = await response.text();
      expect(text).toBe("plain body");
      expect(sentRequest(spy).headers.get("accept")).toBe("text/*");
    });

    it("json() should set accept application/json by default", async () => {
      const spy = mockFetch(jsonResponse({ ok: true }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });
      await response.json();

      expect(sentRequest(spy).headers.get("accept")).toBe("application/json");
    });

    it("json() should preserve an already defined accept header", async () => {
      const spy = mockFetch(jsonResponse({ ok: true }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
        headers: { accept: "application/vnd.custom+json" },
      });
      await response.json();

      expect(sentRequest(spy).headers.get("accept")).toBe(
        "application/vnd.custom+json",
      );
    });

    it("json() should return an empty string on status 204", async () => {
      mockFetch(new Response(null, { status: 204 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      await expect(response.json()).resolves.toBe("");
    });

    it("json() should return an empty string when the body is empty", async () => {
      mockFetch(new Response("", { status: 200 }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      await expect(response.json()).resolves.toBe("");
    });
  });

  describe("chained transform", () => {
    it("should add new properties merging with the raw data", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform((data: any) => ({
        cepFormatted: `CEP: ${data.cep}`,
      }));

      const data = await response.json();

      expect(data).toEqual({
        cep: "89010025",
        cepFormatted: "CEP: 89010025",
      });
    });

    it("should override an existing property", async () => {
      mockFetch(jsonResponse({ cep: "89010025", state: "SC" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform((data: any) => ({
        cep: Number(data.cep),
      }));

      const data = await response.json<{ cep: number; state: string }>();

      expect(data.cep).toBe(89010025);
      expect(data.state).toBe("SC");
    });

    it("should receive the raw data and the original Response", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));
      const transform = vi.fn((data: any, _response: Response) => data);

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform(transform);
      await response.json();

      expect(transform).toHaveBeenCalledTimes(1);
      expect(transform.mock.calls[0][0]).toEqual({ cep: "89010025" });
      expect(transform.mock.calls[0][1]).toBeInstanceOf(Response);
    });

    it("should return the raw result when it is not an object", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform((data) => JSON.stringify(data));

      const data = await response.json<string>();

      expect(typeof data).toBe("string");
      expect(JSON.parse(data)).toHaveProperty("cep", "89010025");
    });

    it("should return the transform result when the raw data is not an object", async () => {
      mockFetch(jsonResponse(42));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform((value: any) => ({ value }));

      const data = await response.json<{ value: number }>();

      expect(data).toEqual({ value: 42 });
    });

    it("should support an async transform", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform(async (data: any) => ({
        ...data,
        async: true,
      }));

      const data = await response.json();

      expect(data).toEqual({ cep: "89010025", async: true });
    });

    it("should apply multiple transforms in sequence", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      })
        .transform((data: any) => ({
          ...data,
          first: true,
        }))
        .transform((data: any) => ({
          ...data,
          second: true,
        }));

      const data = await response.json();

      expect(data).toEqual({
        cep: "89010025",
        first: true,
        second: true,
      });
    });

    it("should keep the original data when the transform returns undefined", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));
      const sideEffect = vi.fn();

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      }).transform((data: any) => {
        sideEffect(data);
      });

      const data = await response.json();

      expect(sideEffect).toHaveBeenCalledWith({ cep: "89010025" });
      expect(data).toEqual({ cep: "89010025" });
    });

    it("should not change the data when no transform is registered", async () => {
      mockFetch(jsonResponse({ cep: "89010025" }));

      const response = Fwrp.create(CreateURL.create(BASE_URL), {
        method: "GET",
      });

      const data = await response.json();

      expect(data).toEqual({ cep: "89010025" });
    });
  });
});
