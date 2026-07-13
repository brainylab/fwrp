---
"@brainylab/fwrp": major
---

Move `transform` from the request config into a chained `.transform()` method.

**BREAKING CHANGE:** the `transform` option was removed from the config object of
`get`, `post`, `put`, `patch`, `delete`, `head` and `fetch`. It is now a chained
method on the returned request, which enables full type inference of the
transformed data (the raw type comes from `get<T>()` and the result is merged
with the transform's return type).

Additional improvements:

- Support for **multiple chained transforms**, applied in sequence (each receives
  the previous result).
- A transform that returns `undefined`/`void` now **keeps the original data**,
  so it can be used for side-effects (logging, telemetry) without dropping the payload.

Migration:

```ts
// Before (v1)
fwrp.get<User>("/users/1", {
  transform: (data) => ({ ...data, label: data.name }),
});

// After (v2)
fwrp.get<User>("/users/1").transform((data) => ({ ...data, label: data.name }));
```
