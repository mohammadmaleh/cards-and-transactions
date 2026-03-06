# useUrlState

Syncs a single URL search parameter to component state. Works like `useState` but persists in the URL. The setter accepts a record of updates so multiple params can be changed atomically in one call.

## Signature

```ts
useUrlState(key: string, defaultValue?: string): [string, (updates: Record<string, string | null>) => void]
```

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `key` | `string` | The URL search parameter to read |
| `defaultValue` | `string` | Value returned when the param is absent. Defaults to `""` |

## Returns

A tuple of `[value, setValue]`:
- `value` — current value of `key`, or `defaultValue` if absent
- `setValue(updates)` — applies all entries in `updates` atomically. Pass `null` as a value to remove that param.

## Usage

```tsx
const [cardId, setParams] = useUrlState("card", "");
const [filter] = useUrlState("filter", "");

// Update a single param
setParams({ card: "abc-123" });           // ?card=abc-123

// Remove a param
setParams({ filter: null });              // removes ?filter from URL

// Update multiple params atomically — no race condition
setParams({ card: "abc-123", filter: null });  // ?card=abc-123
```

## Behaviour

- All values are stored and returned as `string`. Parse to other types in the consumer.
- The setter updates all entries in a single `setSearchParams` call — no double-render, no race condition.
- Params not mentioned in the update object are left unchanged.
- Requires the component to be rendered inside a React Router `<RouterProvider>`.

## Edge Cases

| Input | Result |
|---|---|
| Param absent, no default | Returns `""` |
| Param absent, default provided | Returns `defaultValue` |
| `setValue({ key: null })` when param already absent | No-op |
| `setValue({ key: "" })` | Sets param to empty string (not the same as removing it) |

## Security

Never pass sensitive values (card numbers, CVV) as a key or value. URL params appear in browser history, server logs, and referrer headers.
