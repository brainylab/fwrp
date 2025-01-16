import { describe, it, expect } from 'vitest';

import { isValidUrl } from './is-valid-url';

describe('isValidUrl', () => {
	it('should return true for a valid URL with http', () => {
		expect(isValidUrl('http://example.com')).toBe(true);
	});

	it('should return true for a valid URL with https', () => {
		expect(isValidUrl('https://example.com')).toBe(true);
	});

	it('should return true for a valid URL with a port', () => {
		expect(isValidUrl('http://example.com:8080')).toBe(true);
	});

	it('should return true for a valid URL with a path', () => {
		expect(isValidUrl('http://example.com/path')).toBe(true);
	});

	it('should return true for a valid URL with a complex path', () => {
		expect(isValidUrl('http://example.com/path/test-test/path_two')).toBe(true);
	});

	it('should return true for a valid URL with a query string', () => {
		expect(isValidUrl('http://example.com/path?query=string')).toBe(true);
	});

	it('should return true for a valid URL with an IP address', () => {
		expect(isValidUrl('http://127.0.0.1')).toBe(true);
	});

	it('should return true for a valid URL with an LocalHost address', () => {
		expect(isValidUrl('http://localhost')).toBe(true);
	});

	it('should return false for an invalid URL', () => {
		expect(isValidUrl('invalid-url')).toBe(false);
	});

	it('should return false for a URL without protocol', () => {
		expect(isValidUrl('example.com')).toBe(false);
	});

	it('should return false for a URL with an invalid domain', () => {
		expect(isValidUrl('http://invalid_domain')).toBe(false);
	});
});
