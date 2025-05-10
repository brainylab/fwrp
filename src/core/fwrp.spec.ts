import { HttpRequestError } from '../errors/http-request-error';

import { fwrpErrorHandling } from './error-handling';
import { Fwrp } from './fwrp';

describe('fetch-wrapper', () => {
	it('should be able to make a GET request', async () => {
		const response = Fwrp.create(
			'https://brasilapi.com.br/api/cep/v2/89010025',
			{
				method: 'GET',
			},
		);

		const { status, statusText } = await response;
		const data = await response.json();

		expect(status).toBe(200);
		expect(statusText).toBe('OK');
		expect(typeof data).toBe('object');
		expect(data).toHaveProperty('cep');
	});

	it('should be able to return an HttpRequestError error on a request', async () => {
		try {
			Fwrp.create('https://brasilapi.com.br/api/cep/v2', {
				method: 'GET',
			});
		} catch (err) {
			expect(err).toBeInstanceOf(HttpRequestError);
		}
	});

	it('should be able to using hook before request', async () => {
		const response = Fwrp.create(
			'https://brasilapi.com.br/api/cep/v2/89010025',
			{
				method: 'GET',
				hooks: {
					beforeRequest: async (request) => {
						request.headers.set('x-custom-header', 'custom-value');
					},
				},
			},
		);
		const { headers } = await response.request();

		expect(headers.get('x-custom-header')).toEqual('custom-value');
	});

	it('should be able to intercept an HttpRequestError error on a request', async () => {
		const response = Fwrp.create(
			'https://brasilapi.com.br/api/cep/v2/89010025',
			{
				method: 'GET',
				hooks: {
					beforeRequest: async () => {
						throw new Error('intercept error');
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

	it('should be able to return an HttpRequestError error on a request connection refused', async () => {
		try {
			const response = Fwrp.create('http://localhost', {
				method: 'GET',
			});

			await response.json();
		} catch (err) {
			const { error } = fwrpErrorHandling(err);

			expect(error).toBe('CONNECTION_REFUSED');
		}
	});
});
