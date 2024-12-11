export type ObjectEntries<T> =
	T extends ArrayLike<infer U>
		? Array<[string, U]>
		: Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;
