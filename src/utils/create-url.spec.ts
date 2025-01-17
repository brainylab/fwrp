import { describe, it, expect } from 'vitest';

import { CreateURL } from './create-url';

describe('CreateURL', () => {
	/**
	 * The CreateURL class is used to create a URL by joining a prefix URL and a path.
	 */
	it('should remove trailing slash from prefix', () => {
		const result = CreateURL.create('http://example.com/', '/path');
		expect(result.toString()).toBe('http://example.com/path');
	});

	it('should add leading slash to path if it does not exist', () => {
		const result = CreateURL.create('http://example.com', 'path');
		expect(result.toString()).toBe('http://example.com/path');
	});

	it('should remove path if it is just a slash', () => {
		const result = CreateURL.create('http://example.com', '/');
		expect(result.toString()).toBe('http://example.com');
	});

	it('should remove path if it is an empty string', () => {
		const result = CreateURL.create('http://example.com', '');
		expect(result.toString()).toBe('http://example.com');
	});

	it('should join prefix and path correctly', () => {
		const result = CreateURL.create('http://example.com', '/path');
		expect(result.toString()).toBe('http://example.com/path');
	});

	it('should create url with params', () => {
		const result = CreateURL.create('http://example.com', '/path');

		result.addParams({
			test: 'test',
		});

		expect(result.toString()).toBe('http://example.com/path?test=test');
	});

	it('should throw an error if prefix URL is invalid', () => {
		expect(() => CreateURL.create('invalid-url', '/path')).toThrow(
			'prefix URL is invalid!',
		);
	});

	it('should throw an error if path is invalid', () => {
		expect(() =>
			CreateURL.create('http://example.com', 'resource+with+pluses'),
		).toThrow('path is invalid!');
	});

	it('should throw an error if single url is invalid', () => {
		expect(() => CreateURL.create('example.com')).toThrow('URL is invalid!');
	});
});
