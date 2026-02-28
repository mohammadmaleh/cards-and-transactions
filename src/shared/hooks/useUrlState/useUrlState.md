# useUrlState

Syncs a single URL search parameter to component state. Works like `useState` but persists in the URL.

## Signature

```ts
useUrlState(key: string, defaultValue?: string): [string, (value: string | null) => void]
```

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `key` | `string` | The URL search parameter name |
| `defaultValue` | `string` | Value returned when the param is absent. Defaults to `""` |

## Returns

A tuple of `[value, setValue]`:
- `value` — current param value, or `defaultValue` if absent
- `setValue(v)` — sets the param to `v`. Pass `null` to remove the param entirely

## Usage

```tsx
const [cardId, setCardId] = useUrlState("card", "");
const [filter, setFilter] = useUrlState("filter", "");

// Set a value
setCardId("abc-123");           // ?card=abc-123

// Remove a param
setFilter(null);                // removes ?filter from URL

// Both in URL
// ?card=abc-123&filter=50
```

## Behaviour

- All values are stored and returned as `string`. Parse to other types in the consumer.
- Setting a value never removes other params — each key is independent.
- Removing a param (`null`) falls back to `defaultValue` on the next render.
- Requires the component to be rendered inside a React Router `<RouterProvider>`.

## Edge Cases

| Input | Result |
|---|---|
| Param absent, no default | Returns `""` |
| Param absent, default provided | Returns `defaultValue` |
| `setValue(null)` when param already absent | No-op |
| `setValue("")` | Sets param to empty string (not the same as removing it) |

## Security

Never pass sensitive values (card numbers, IBANs, CVV) as the `key` or `value`. URL params appear in browser history, server logs, and referrer headers.
