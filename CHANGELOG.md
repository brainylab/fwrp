# @brainylab/fwrp

## 1.4.1

### Patch Changes

- [`a95ccb9`](https://github.com/brainylab/fwrp/commit/a95ccb9e1b17570d55c920cd7263b96739cdfb39) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - refactor: substituir método 'request' por 'fetch' e aprimorar a classe CreateURL

## 1.4.0

### Minor Changes

- [`c71229a`](https://github.com/brainylab/fwrp/commit/c71229ac7a1ee76f72837533fb72a77df8080ac4) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - add suport to new method, request

- [`35b57ff`](https://github.com/brainylab/fwrp/commit/35b57ff8778f10651a8f7a2c330ca5860d07bd66) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - feat: extend HTTP methods and enhance request handling

  - Added 'request' method to the list of supported HTTP methods in constants.
  - Introduced RequestInitConfigs type to include URL and method for requests.
  - Updated createInstance to handle both string URL and RequestInitConfigs for method calls.
  - Refactored URL creation logic in CreateURL class to improve readability and maintainability.
  - Ensured URL validation and construction logic is encapsulated within the CreateURL class.

## 1.3.2

### Patch Changes

- [`92b216c`](https://github.com/brainylab/fwrp/commit/92b216c342106bb685bc636ec688d8252b10f64a) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - refactor: ajustar formatação de importações e adicionar exportação de tipos

## 1.3.1

### Patch Changes

- [`d0447d0`](https://github.com/brainylab/fwrp/commit/d0447d04ec6250182c201251447846e58e4c8c93) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - fix types from response error

## 1.3.0

### Minor Changes

- [`ad85bdd`](https://github.com/brainylab/fwrp/commit/ad85bdd68799be5a6cd17f83b5c2eb409213358c) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - correção dos nomes do hooks, alterado de after para before request

## 1.2.1

### Patch Changes

- [`5a12fb7`](https://github.com/brainylab/fwrp/commit/5a12fb756192a7c29647d787a2706c28a94a6bf1) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - error handling type fix

## 1.2.0

### Minor Changes

- [`1e60985`](https://github.com/brainylab/fwrp/commit/1e60985d925e4e07a2173bb68b327eef7b989184) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - criado novo algoritmo para lidar com a criacão e gerenciamento de URL

## 1.1.0

### Minor Changes

- [`5f72436`](https://github.com/brainylab/fwrp/commit/5f724369aeaf5ce3765548ab2b5f3aa7feafe117) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - refactor: refatorado criador de URL, e adicionado novos sistema para validar URL e o patch

### Patch Changes

- [`d113ecd`](https://github.com/brainylab/fwrp/commit/d113ecdaf61f62b28610f65d9ce17b44fdf9e5ff) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - remove console.logs

## 1.0.11

### Patch Changes

- [`e9285e7`](https://github.com/brainylab/fwrp/commit/e9285e7668c2ff3e2ab3ef565dc5b5f266ff17aa) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - fix types and extends on declare module

## 1.0.10

### Patch Changes

- [`077ebab`](https://github.com/brainylab/fwrp/commit/077ebab99d9f15f3e0e886eaa521513832afb973) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - create types from error handler return json

## 1.0.9

### Patch Changes

- [`246b220`](https://github.com/brainylab/fwrp/commit/246b2208d74625e7718b4409f7991ced952154b9) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - corrigido error handling que retornava uma promise json ou text sem o bind da intancia HTTPError

## 1.0.8

### Patch Changes

- [`e12abf6`](https://github.com/brainylab/fwrp/commit/e12abf61258153224b1e2869fd8e7c2194eb7245) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - correção ao retornar json e text no error handling

## 1.0.7

### Patch Changes

- [`195b10b`](https://github.com/brainylab/fwrp/commit/195b10b039de425c79ec8e108f2884469df8d5d3) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - fix post,put send body json

## 1.0.6

### Patch Changes

- [`110969e`](https://github.com/brainylab/fwrp/commit/110969ee6fd4b247b6d98c4c122c78937e51b444) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - fix types

## 1.0.5

### Patch Changes

- [`14d2249`](https://github.com/brainylab/fwrp/commit/14d224922ccb1a5c844ba3022d3079925919bea8) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - adicionado suporte a conversão do body automaticamente como segundo argumento na função

## 1.0.4

### Patch Changes

- [`537d8f9`](https://github.com/brainylab/fwrp/commit/537d8f9884eba554d8225033a80b9b43b6a0110b) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - adicionado validação de path no prefixUrl

## 1.0.3

### Patch Changes

- [`5b6c796`](https://github.com/brainylab/fwrp/commit/5b6c7968c9c5f0a502ba39a1dd10fa3344b94ff1) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - clean package

## 1.0.2

### Patch Changes

- [`03c31ee`](https://github.com/brainylab/fwrp/commit/03c31eecb8c5b3451b690ae01179972313fa95e0) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - ajustes nos arquivos instalados

## 1.0.1

### Patch Changes

- [`95171b0`](https://github.com/brainylab/fwrp/commit/95171b09706597296acdb3d568e9e75ce5bf15bc) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - adicionado clean package

- [`ca320c7`](https://github.com/brainylab/fwrp/commit/ca320c7e45d541eec7205191fc65dd43c47eabae) Thanks [@andrefelipeschulle](https://github.com/andrefelipeschulle)! - adicionando suporte ao changeset
