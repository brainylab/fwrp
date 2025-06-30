import { isValidPath } from './is-valid-path';
import { isValidPrefix } from './is-valid-prefix';
import { isValidUrl } from './is-valid-url';
import { objectToUrlParams, type ObjectToUrl } from './object-to-url-params';

export class CreateURL {
	private readonly url: string;
	private readonly params?: ObjectToUrl;

	private constructor(url: string, params?: ObjectToUrl) {
		this.url = url;
		this.params = params;
	}

	private static buildUrl(url: string, path?: string): string {
		const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

		if (!path) {
			if (!isValidUrl(cleanUrl)) {
				throw new Error('URL is invalid!');
			}
			return cleanUrl;
		}

		if (!isValidPrefix(cleanUrl)) {
			throw new Error('prefix URL is invalid!');
		}

		if (!isValidPath(path)) {
			throw new Error('path is invalid!');
		}

		let cleanPath = path;
		if (cleanPath.length > 0 && !cleanPath.startsWith('/')) {
			cleanPath = '/' + cleanPath;
		}
		if (cleanPath === '/' || cleanPath.trim() === '') {
			cleanPath = '';
		}

		return cleanUrl.concat(cleanPath);
	}

	public addParams(params: ObjectToUrl): CreateURL {
		return new CreateURL(this.url, params);
	}

	public getParams() {
		return this.params;
	}

	public toString() {
		const baseUrl = this.url;

		if (this.params) {
			const params = objectToUrlParams(this.params);
			return `${baseUrl}?${params}`;
		}

		return baseUrl;
	}

	static create(url: string, path?: string): CreateURL {
		const builtUrl = CreateURL.buildUrl(url, path);
		return new CreateURL(builtUrl);
	}
}
