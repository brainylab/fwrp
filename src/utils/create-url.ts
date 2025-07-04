import { isValidPath } from './is-valid-path';
import { isValidPrefix } from './is-valid-prefix';
import { isValidUrl } from './is-valid-url';
import { objectToUrlParams, type ObjectToUrl } from './object-to-url-params';

export class CreateURL {
	private url: string;
	private params?: ObjectToUrl;

	constructor() {
		this.url = '';
	}

	private createUrl(url: string, path?: string) {
		if (url.endsWith('/')) {
			url = url.slice(0, -1);
		}

		if (!path) {
			// if (!isValidUrl(url)) {
			// 	throw new Error('URL is invalid!');
			// }

			this.url = url;

			return;
		}

		// if (!isValidPrefix(url)) {
		// 	throw new Error('prefix URL is invalid!');
		// }

		// if (!isValidPath(path)) {
		// 	throw new Error('path is invalid!');
		// }

		if (path.length > 0 && !path.startsWith('/')) {
			path = '/' + path;
		}

		if (path === '/' || path.trim() === '') {
			path = '';
		}

		this.url = url.concat(path);
		return;
	}

	public addParams(params: ObjectToUrl) {
		this.params = params;
	}

	public getParams() {
		return this.params;
	}

	public toString() {
		if (this.params) {
			const params = objectToUrlParams(this.params);

			this.url = `${this.url}?${params}`;
		}

		return this.url;
	}

	static create(url: string, path?: string) {
		const instance = new CreateURL();

		instance.createUrl(url, path);

		return instance;
	}
}
