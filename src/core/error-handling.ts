import { HttpRequestError } from '../errors/http-request-error';

import type { JsonErrorHandling } from '../types';

type FetchTypeError = TypeError & {
	cause?: { code: 'ECONNREFUSED'; address: string; port: number };
};

export type ErrorHandlingResponse<T> = {
	code?: number;
	message: string;
	error: 'HTTP_REQUEST_ERROR' | 'CONNECTION_REFUSED' | 'UNEXPECTED_ERROR';
	json: <D = T>() => Promise<D>;
	text: () => Promise<string>;
	throw?: unknown;
};

export function fwrpErrorHandling<T = JsonErrorHandling>(
	error: unknown,
): ErrorHandlingResponse<T> {
	if (error instanceof HttpRequestError) {
		return {
			code: error.code,
			message: error.message,
			json: error.json as <D = T>() => Promise<D>,
			text: error.text,
			error: 'HTTP_REQUEST_ERROR',
		};
	}

	if (error instanceof TypeError) {
		const err = error as FetchTypeError;

		if (err?.cause && err?.cause.code === 'ECONNREFUSED') {
			return {
				message: `connection refused ${err.cause.address} on port ${err.cause.port}`,
				json: async <D = T>() => ({}) as unknown as D,
				text: async () => '',
				error: 'CONNECTION_REFUSED',
			};
		}
	}

	return {
		message: 'an unexpected error occurred',
		error: 'UNEXPECTED_ERROR',
		json: async <D = T>() => ({}) as unknown as D,
		text: async () => '',
		throw: error,
	};
}
