---
'@brainylab/fwrp': minor
---

feat: extend HTTP methods and enhance request handling

- Added 'request' method to the list of supported HTTP methods in constants.
- Introduced RequestInitConfigs type to include URL and method for requests.
- Updated createInstance to handle both string URL and RequestInitConfigs for method calls.
- Refactored URL creation logic in CreateURL class to improve readability and maintainability.
- Ensured URL validation and construction logic is encapsulated within the CreateURL class.
