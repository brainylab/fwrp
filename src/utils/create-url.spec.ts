import { describe, it, expect } from 'vitest';

import { createUrl } from './create-url';

describe('createUrl', () => {
	it('should remove trailing slash from prefix', () => {
		const result = createUrl('http://example.com/', '/path');
		expect(result).toBe('http://example.com/path');
	});

	it('should add leading slash to path if it does not exist', () => {
		const result = createUrl('http://example.com', 'path');
		expect(result).toBe('http://example.com/path');
	});

	it('should remove path if it is just a slash', () => {
		const result = createUrl('http://example.com', '/');
		expect(result).toBe('http://example.com');
	});

	it('should remove path if it is an empty string', () => {
		const result = createUrl('http://example.com', '');
		expect(result).toBe('http://example.com');
	});

	it('should join prefix and path correctly', () => {
		const result = createUrl('http://example.com', '/path');
		expect(result).toBe('http://example.com/path');
	});

	it('should throw an error if prefix URL is invalid', () => {
		expect(() => createUrl('invalid-url', '/path')).toThrow(
			'prefix URL is invalid!',
		);
	});

	it('should throw an error if path is invalid', () => {
		expect(() =>
			createUrl('http://example.com', 'resource+with+pluses'),
		).toThrow('path is invalid!');
	});
});
