import { fwrp } from './src';

(async () => {
	// const api = fwrp.create('https://brasilapi.com.br/api');

	const response = fwrp
		.create('https://brasilapi.com.br', {
			headers: {
				'x-custom-header': 'custom-value',
			},
			// hooks: {
			// 	afterRequest: async (request) => {
			// 		request.headers.set('x-custom-header', 'custom-value');
			// 	},
			// },
		})
		.get('/api/cep/v2/89010025', {
			// headers: {
			// 	'x-custom-header': 'custom-value',
			// },
		});

	// console.log(await response.request());

	const { headers } = await response.request();

	console.log(headers.has('x-custom-header'));

	// console.log(await fwrp.create);
	// console.log(
	// 	// await fwpr.create('https://brasilapi.com.br/api').get('/cep/v2/89010025'),
	// );
	// await fwpr.create('https://localhost').get('/all').json();
})();
