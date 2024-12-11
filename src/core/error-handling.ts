import { HttpRequestError } from 'src/errors/http-request-error';

type FetchTypeError = TypeError & {
	cause?: { code: 'ECONNREFUSED'; address: string; port: number };
};

export type ErrorHandlingResponse = {
	code?: number;
	message: string;
	json?: <D>() => Promise<D>;
	text?: () => Promise<string>;
	error: 'HTTP_REQUEST_ERROR' | 'CONNECTION_REFUSED' | 'UNEXPECTED_ERROR';
	throw?: unknown;
};

export function fwrpErrorHandling(error: unknown): ErrorHandlingResponse {
	if (error instanceof HttpRequestError) {
		return {
			code: error.code,
			message: error.message,
			json: error.response.json,
			text: error.response.text,
			error: 'HTTP_REQUEST_ERROR',
		};
	}

	if (error instanceof TypeError) {
		const err = error as FetchTypeError;

		if (err?.cause && err?.cause.code === 'ECONNREFUSED') {
			return {
				message: `connection refused ${err.cause.address} on port ${err.cause.port}`,
				error: 'CONNECTION_REFUSED',
			};
		}
	}

	return {
		message: 'an unexpected error occurred',
		error: 'UNEXPECTED_ERROR',
		throw: error,
	};
}
