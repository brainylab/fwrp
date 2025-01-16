import { HttpRequestError } from 'src/errors/http-request-error';

import { fwrp } from '../index';

import { fwrpErrorHandling } from './error-handling';

describe('error-handling', () => {
	it('should handle HttpRequestError', async () => {
		const error = fwrpErrorHandling(
			new HttpRequestError(
				{
					status: 404,
					statusText: 'Not Found',
					json: () => Promise.resolve({ message: 'Not Found' }),
				} as Response,
				{} as Request,
			),
		);

		expect(error).toHaveProperty('error');
		expect(error.error).toEqual('HTTP_REQUEST_ERROR');
	});

	it('should handle ECONNREFUSED error', async () => {
		try {
			await fwrp.get('http://localhost');
		} catch (error) {
			const result = fwrpErrorHandling(error);

			expect(result).toHaveProperty('error');
			expect(result.error).toEqual('CONNECTION_REFUSED');
		}
	});

	it('should handle unknown error', () => {
		const error = { code: 'UNKNOWN_ERROR' };
		const result = fwrpErrorHandling(error);

		expect(result).toHaveProperty('error');
		expect(result.error).toEqual('UNEXPECTED_ERROR');
	});
});
