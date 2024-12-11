import { fwrp } from '../index';

import { createInstance } from './create-instance';

describe('create-instance', () => {
	it('should create an instance of FetchWrapper', () => {
		const instance = createInstance('http://localhost');

		expect(instance).keys(['get', 'post', 'put', 'delete', 'patch', 'head']);
	});

	it('should create an instance of FetchWrapper using index.js', () => {
		const instance = fwrp.create('http://localhost:3000');

		expect(instance).keys(['get', 'post', 'put', 'delete', 'patch', 'head']);
	});
});
