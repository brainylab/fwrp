import { HttpRequestError } from 'src/errors/http-request-error';

type FetchTypeError = TypeError & {
	cause?: { code: 'ECONNREFUSED'; address: string; port: number };
};

export type ErrorHandlingResponse = {
	code?: number;
	message: string;
	error: 'HTTP_REQUEST_ERROR' | 'CONNECTION_REFUSED' | 'UNEXPECTED_ERROR';
	json: () => Promise<unknown>;
	text: () => Promise<string>;
	throw?: unknown;
};

export function fwrpErrorHandling(error: unknown): ErrorHandlingResponse {
	if (error instanceof HttpRequestError) {
		return {
			code: error.code,
			message: error.message,
			json: error.json,
			text: error.text,
			error: 'HTTP_REQUEST_ERROR',
		};
	}

	if (error instanceof TypeError) {
		const err = error as FetchTypeError;

		if (err?.cause && err?.cause.code === 'ECONNREFUSED') {
			return {
				message: `connection refused ${err.cause.address} on port ${err.cause.port}`,
				json: async () => ({}),
				text: async () => '',
				error: 'CONNECTION_REFUSED',
			};
		}
	}

	return {
		message: 'an unexpected error occurred',
		error: 'UNEXPECTED_ERROR',
		json: async () => ({}),
		text: async () => '',
		throw: error,
	};
}
