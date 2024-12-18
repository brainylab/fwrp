export class HttpRequestError extends Error {
	public code: number;
	public response: Response;
	public request: Request;
	public json: () => Promise<unknown>;
	public text: () => Promise<string>;

	constructor(response: Response, request: Request) {
		const code =
			response.status || response.status === 0 ? response.status : '';
		const title = response.statusText || '';
		const status = `${code} ${title}`.trim();
		const reason = status ? `status code ${status}` : 'an unknown error';

		super(`request failed with ${reason}: ${request.method} ${request.url}`);

		this.name = 'HttpRequestError';
		this.code = response.status;

		this.json = response.json.bind(response);
		this.text = response.json.bind(response);

		this.response = response;
		this.request = request;
	}
}
