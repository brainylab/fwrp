import { HttpRequestError } from './http-request-error';

describe('http-request-error', () => {
	it('should be http error', () => {
		const mockResponse = {
			status: 404,
			statusText: 'Not Found',
			json: () => Promise.resolve({ message: 'Not Found' }),
		} as Response;

		const errorInstance = new HttpRequestError(mockResponse, {} as Request);

		expect(errorInstance.name).toBe('HttpRequestError');
		expect(errorInstance.code).toBe(mockResponse.status);
	});

	it('should be http error it not message and statusText', () => {
		const mockResponse = {
			status: 404,
			json: () => Promise.resolve({ message: 'Not Found' }),
		} as Response;

		const errorInstance = new HttpRequestError(mockResponse, {} as Request);

		expect(errorInstance.name).toBe('HttpRequestError');
		expect(errorInstance.code).toBe(mockResponse.status);
	});
});
