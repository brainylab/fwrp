import { describe, it, expect } from 'vitest';

import { isValidPath } from './is-valid-path';

describe('isValidPath', () => {
	it('should return true for valid paths', () => {
		expect(isValidPath('/')).toBe(true);
		expect(isValidPath('/path')).toBe(true);
		expect(isValidPath('/path/to/resource')).toBe(true);
		expect(isValidPath('/path/to/resource/')).toBe(true);
		expect(isValidPath('/path/to/resource?query=1')).toBe(true);
		expect(isValidPath('/path/to/resource?query=1&query2=2')).toBe(true);
	});

	it('should return true for paths with special characters', () => {
		expect(isValidPath('/path/to/resource_with_underscores')).toBe(true);
		expect(isValidPath('/path/to/resource-with-dashes')).toBe(true);
		expect(isValidPath('/path/to/resource.with.dots')).toBe(true);
	});

	it('should return false for paths with special characters', () => {
		expect(isValidPath('/path/to/resource%20with%20spaces')).toBe(false);
		expect(isValidPath('/path/to/resource~with~tildes')).toBe(false);
		expect(isValidPath('/path/to/resource+with+pluses')).toBe(false);
	});

	it('should return false for paths with protocol, domain, IP, or port', () => {
		expect(isValidPath('http://example.com/path')).toBe(false);
		expect(isValidPath('https://example.com/path')).toBe(false);
		expect(isValidPath('http://192.168.0.1/path')).toBe(false);
		expect(isValidPath('https://192.168.0.1/path')).toBe(false);
		expect(isValidPath('http://example.com:8080/path')).toBe(false);
		expect(isValidPath('https://example.com:8080/path')).toBe(false);
		expect(isValidPath('example.com:8080/path')).toBe(false);
	});

	it('should return false for invalid paths', () => {
		expect(isValidPath('/path//to//resource')).toBe(false);
	});
});
