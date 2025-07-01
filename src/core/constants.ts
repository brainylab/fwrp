export const responseTypes = {
	json: 'application/json',
	text: 'text/*',
	// formData: 'multipart/form-data',
	// arrayBuffer: '*/*',
	// blob: '*/*',
	request: '*/*',
} as const;

export const methods = [
	'get',
	'post',
	'put',
	'delete',
	'patch',
	'head',
	'fetch',
];
