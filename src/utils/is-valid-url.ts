export function isValidUrl(url: string): boolean {
	const urlPattern = new RegExp(
		'^(https?:\\/\\/)' +
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
			'((\\d{1,3}\\.){3}\\d{1,3}))' +
			'(\\:\\d+)?' +
			'(\\/[^\\s]*)?' +
			'(\\?[^#]*)?$',
		'i',
	);

	return !!urlPattern.test(url);
}
