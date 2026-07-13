export type ObjectEntries<T> =
  T extends ArrayLike<infer U>
    ? Array<[string, U]>
    : Array<{ [K in keyof T]: [K, T[K]] }[keyof T]>;

export type Merge<T, R> = Omit<T, keyof R> & R;

/**
 * `true` quando `T` é exatamente `any`.
 */
type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Aplica o retorno de um transform (`R`) sobre o tipo atual (`T`),
 * espelhando o comportamento de runtime em `Fwrp`:
 * - transform sem retorno (`void`/`undefined`) -> mantém `T`
 * - `T` é `any` (tipado via `data`) -> apenas o retorno do transform
 * - transform retorna objeto + T objeto -> Merge<T, R>
 * - transform retorna outro (string, etc.) -> o próprio R
 */
export type TransformMerge<T, R> = [R] extends [void]
  ? T
  : IsAny<T> extends true
    ? R
    : R extends object
      ? T extends object
        ? Merge<T, R>
        : R
      : R;
