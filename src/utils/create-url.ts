import { isValidPath } from './is-valid-path';
import { isValidPrefix } from './is-valid-prefix';
import { isValidUrl } from './is-valid-url';

export function createUrl(url: string, path?: string) {
	if (url.endsWith('/')) {
		url = url.slice(0, -1);
	}

	if (!path) {
		if (!isValidUrl(url)) {
			throw new Error('URL is invalid!');
		}

		return url;
	}

	if (!isValidPrefix(url)) {
		throw new Error('prefix URL is invalid!');
	}

	if (!isValidPath(path)) {
		throw new Error('path is invalid!');
	}

	if (path.length > 0 && !path.startsWith('/')) {
		path = '/' + path;
	}

	if (path === '/' || path.trim() === '') {
		path = '';
	}

	return url.concat(path);
}
