export function isValidPath(url: string): boolean {
	const pathPattern = new RegExp(
		'^' +
			'(\\/)?' +
			'([a-zA-Z\\d_.-]+\\/)*' +
			'([a-zA-Z\\d_.-]+)?' +
			'(\\?[^#]*)?$',
	);

	return !!pathPattern.test(url);
}
