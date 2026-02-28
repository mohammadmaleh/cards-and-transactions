# formatAmount

Formats a raw transaction amount into a display-ready EUR string with sign.

## Signature

```ts
formatAmount(rawAmount: number): string
```

## Parameters

| Parameter | Type | Description |
|---|---|---|
| `rawAmount` | `number` | Raw amount as stored in the data source |

## Returns

A formatted string using `de-DE` locale and EUR currency, with explicit sign.

## Usage

```ts
formatAmount(123.88)   // "-123,88 €"   (expense)
formatAmount(-100)     // "+100,00 €"   (refund)
formatAmount(0)        // "0,00 €"      (no sign for zero)
formatAmount(1234.56)  // "-1.234,56 €"
```

## Data Convention

The raw data stores amounts with **inverted sign semantics**:

| Raw value | Meaning | Displayed as |
|---|---|---|
| Positive (e.g. `123.88`) | Expense (money leaving) | Negative (`-123,88 €`) |
| Negative (e.g. `-100.00`) | Refund (money returning) | Positive (`+100,00 €`) |

The sign flip happens **only in this function**. Business logic and filter logic always operate on raw values.

## Locale

Uses `Intl.NumberFormat` with `de-DE` locale — comma as decimal separator, period as thousands separator. DKB is a German bank; the design mockup confirms this format.
