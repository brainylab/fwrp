import { ParseError } from "./parse-error";

describe("parse-error", () => {
  function mockResponse(contentType?: string): Response {
    return {
      headers: {
        get: (key: string) =>
          key.toLowerCase() === "content-type" ? (contentType ?? null) : null,
      },
    } as unknown as Response;
  }

  const request = {
    method: "GET",
    url: "https://api.example.com/resource",
  } as Request;

  it("should be a ParseError instance", () => {
    const cause = new SyntaxError("Unexpected token '<'");
    const error = new ParseError(
      cause,
      "<html></html>",
      mockResponse("text/html"),
      request,
    );

    expect(error).toBeInstanceOf(ParseError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("ParseError");
  });

  it("should preserve the raw body and content-type", () => {
    const error = new ParseError(
      new SyntaxError("boom"),
      "<html>502 Bad Gateway</html>",
      mockResponse("text/html; charset=utf-8"),
      request,
    );

    expect(error.rawBody).toBe("<html>502 Bad Gateway</html>");
    expect(error.contentType).toBe("text/html; charset=utf-8");
  });

  it("should keep the original error as cause", () => {
    const cause = new SyntaxError("Unexpected token '<'");
    const error = new ParseError(cause, "<html>", mockResponse(), request);

    expect(error.cause).toBe(cause);
  });

  it("should expose the response and the request", () => {
    const response = mockResponse("application/json");
    const error = new ParseError(new Error("x"), "not json", response, request);

    expect(error.response).toBe(response);
    expect(error.request).toBe(request);
  });

  it("should include method, url and content-type in the message", () => {
    const error = new ParseError(
      new SyntaxError("boom"),
      "<html>",
      mockResponse("text/html"),
      request,
    );

    expect(error.message).toContain("GET");
    expect(error.message).toContain("https://api.example.com/resource");
    expect(error.message).toContain("text/html");
  });

  it("should fall back to 'unknown' when there is no content-type", () => {
    const error = new ParseError(
      new SyntaxError("boom"),
      "<html>",
      mockResponse(undefined),
      request,
    );

    expect(error.contentType).toBeNull();
    expect(error.message).toContain("unknown");
  });
});
