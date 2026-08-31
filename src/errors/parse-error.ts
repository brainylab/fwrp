export class ParseError extends Error {
  public response: Response;
  public request: Request;
  public contentType: string | null;
  public rawBody: string;

  constructor(
    cause: unknown,
    rawBody: string,
    response: Response,
    request: Request,
  ) {
    const contentType = response.headers.get("content-type");

    super(
      `failed to parse response as JSON: ${request.method} ${request.url} ` +
        `(content-type: ${contentType ?? "unknown"})`,
    );

    this.name = "ParseError";
    this.cause = cause;
    this.contentType = contentType;
    this.rawBody = rawBody;
    this.response = response;
    this.request = request;
  }
}
