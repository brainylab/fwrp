import { HttpRequestError } from "../errors/http-request-error";
import { CreateURL } from "../utils/create-url";
import { fwrpErrorHandling } from "./error-handling";
import { Fwrp } from "./fwrp";

describe("fetch-wrapper", () => {
  it("should be able to make a GET request", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
      },
    );

    const { status, statusText } = await response;
    const data = await response.json();

    expect(status).toBe(200);
    expect(statusText).toBe("OK");
    expect(typeof data).toBe("object");
    expect(data).toHaveProperty("cep");
  });

  it("should be able to return an HttpRequestError error on a request", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2"),
      {
        method: "GET",
      },
    );

    await expect(response).rejects.toBeInstanceOf(HttpRequestError);
  });

  it("should be able to using hook before request", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
        hooks: {
          beforeRequest: async (request) => {
            request.headers.set("x-custom-header", "custom-value");
          },
        },
      },
    );
    const { headers } = await response.request();

    expect(headers.get("x-custom-header")).toEqual("custom-value");
  });

  it("should be able to intercept an HttpRequestError error on a request", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
        hooks: {
          beforeRequest: async () => {
            throw new Error("intercept error");
          },
        },
      },
    );

    try {
      await response.json();
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  });

  it("should be able to return an HttpRequestError error on a request connection refused", async () => {
    try {
      const response = Fwrp.create(CreateURL.create("http://localhost"), {
        method: "GET",
      });

      await response.json();
    } catch (err) {
      const { error } = fwrpErrorHandling(err);

      expect(error).toBe("CONNECTION_REFUSED");
    }
  });

  it("should be able to transform json data adding new properties", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
        transform: (data: any) => ({
          cepFormatted: `CEP: ${data.cep}`,
        }),
      },
    );

    const data = await response.json<any>();

    expect(data).toHaveProperty("cep");
    expect(data).toHaveProperty("cepFormatted", `CEP: ${data.cep}`);
  });

  it("should be able to transform json data overriding an existing property", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
        transform: (data: any) => ({
          cep: Number(data.cep),
        }),
      },
    );

    const data = await response.json<any>();

    expect(typeof data.cep).toBe("number");
    expect(data).toHaveProperty("state");
  });

  it("should call transform with the raw data and the original response", async () => {
    let receivedResponse: Response | undefined;

    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
        transform: (data: any, res) => {
          receivedResponse = res;
          return data;
        },
      },
    );

    await response.json();

    expect(receivedResponse).toBeInstanceOf(Response);
    expect(receivedResponse?.status).toBe(200);
  });

  it("should return the transform result as is when it's not a plain object", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
        transform: (data) => JSON.stringify(data),
      },
    );

    const data = await response.json<any>();

    expect(typeof data).toBe("string");
    expect(JSON.parse(data)).toHaveProperty("cep");
  });

  it("should not apply transform when there is no transform configured", async () => {
    const response = Fwrp.create(
      CreateURL.create("https://brasilapi.com.br/api/cep/v2/89010025"),
      {
        method: "GET",
      },
    );

    const data = await response.json();

    expect(data).not.toHaveProperty("cepFormatted");
  });
});
