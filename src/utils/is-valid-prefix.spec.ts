import { describe, it, expect } from 'vitest';

import { isValidPrefix } from './is-valid-prefix';

describe('isValidPrefix', () => {
	it('should return true for valid URLs with protocol, domain, and path', () => {
		expect(isValidPrefix('http://example.com')).toBe(true);
		expect(isValidPrefix('https://example.com')).toBe(true);
		expect(isValidPrefix('http://example.com/path')).toBe(true);
		expect(isValidPrefix('https://example.com/path')).toBe(true);
		expect(isValidPrefix('http://example.com:8080/path')).toBe(true);
		expect(isValidPrefix('https://example.com:8080/path')).toBe(true);
		expect(isValidPrefix('http://192.168.0.1')).toBe(true);
		expect(isValidPrefix('https://192.168.0.1')).toBe(true);
		expect(isValidPrefix('http://192.168.0.1:8080')).toBe(true);
		expect(isValidPrefix('https://192.168.0.1:8080')).toBe(true);
		expect(isValidPrefix('http://192.168.0.1:8080/path')).toBe(true);
		expect(isValidPrefix('https://192.168.0.1:8080/path')).toBe(true);
		expect(isValidPrefix('http://localhost')).toBe(true);
		expect(isValidPrefix('http://localhost:8080')).toBe(true);
		expect(isValidPrefix('http://localhost:8080/path/path')).toBe(true);
	});

	it('should return false for URLs without protocol', () => {
		expect(isValidPrefix('example.com')).toBe(false);
		expect(isValidPrefix('www.example.com')).toBe(false);
		expect(isValidPrefix('example.com/path')).toBe(false);
	});

	it('should return false for invalid URLs', () => {
		expect(isValidPrefix('http://')).toBe(false);
		expect(isValidPrefix('https://')).toBe(false);
		expect(isValidPrefix('http://.com')).toBe(false);
		expect(isValidPrefix('https://.com')).toBe(false);
		expect(isValidPrefix('http://example..com')).toBe(false);
		expect(isValidPrefix('https://example..com')).toBe(false);
	});

	it('should return false for URLs with query or fragment', () => {
		expect(isValidPrefix('http://example.com?query=1')).toBe(false);
		expect(isValidPrefix('https://example.com?query=1')).toBe(false);
		expect(isValidPrefix('http://example.com#fragment')).toBe(false);
		expect(isValidPrefix('https://example.com#fragment')).toBe(false);
	});
});
