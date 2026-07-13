export type ObjectToUrl = Record<
  string,
  string | number | string[] | number[] | boolean | undefined | null
>;

export function objectToUrlParams(obj: ObjectToUrl): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) params.append(key, String(v));
    } else {
      params.append(key, String(value));
    }
  }
  return params.toString();
}
