export function mergeConfigs(
	defaultConfig?: Record<string, any>,
	newConfig?: Record<string, any>,
) {
	const result: Record<string, unknown> = { ...(defaultConfig || {}) };

	if (!newConfig) {
		return result;
	}

	for (const prop in newConfig) {
		if (Object.prototype.hasOwnProperty.call(newConfig, prop)) {
			if (
				newConfig[prop] &&
				newConfig[prop].constructor === Object &&
				!Array.isArray(newConfig[prop])
			) {
				result[prop] = mergeConfigs(
					result[prop] as Record<string, unknown>,
					newConfig[prop] as Record<string, unknown>,
				);
			} else {
				result[prop] = newConfig[prop];
			}
		}
	}

	return result;
}
