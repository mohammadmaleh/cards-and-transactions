# maskValue

Masks a sensitive string value for display, revealing only the last 4 characters.

## Signature

```ts
maskValue(value: string): string
```

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `value` | `string` | The sensitive string to mask (e.g. a card ID) |

## Returns

A masked string in the format `•••• •••• •••• xxxx` where `xxxx` is the last 4 characters of `value`.

## Usage

```ts
maskValue("abcd-1234-efgh-5678")   // "•••• •••• •••• 5678"
maskValue("abcd")                  // "•••• •••• •••• abcd"
```

## Behaviour

- The prefix (`•••• •••• •••• `) is fixed regardless of the input length.
- Only the last 4 characters of the input are shown.
- If the input is shorter than 4 characters, all characters are shown in the visible portion.

## Security Context

This function is for **display masking only** — it does not provide cryptographic security. The full value still exists in memory. Pair with:
- `user-select: none` on the container (prevent accidental copy)
- A dedicated copy button for intentional clipboard access
- Auto-hide after 30 seconds when revealed
- `aria-label` updates on the reveal toggle for screen reader announcements
