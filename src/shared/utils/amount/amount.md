# Amount Utilities

Formatting and display utilities for transaction amounts.

## formatLocalizedAmount

Formats a raw transaction amount into a localized currency string with sign display.

### Signature

```ts
formatLocalizedAmount(rawAmount: number, locale?: string, currency?: string): string
```

### Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `rawAmount` | `number` | — | Raw amount from the data source |
| `locale` | `string` | `"de-DE"` | BCP 47 locale tag for number formatting |
| `currency` | `string` | `"EUR"` | ISO 4217 currency code |

### Raw Amount Convention

The source data uses a **positive = expense, negative = credit** convention. This function flips the sign at the display layer only — the store always holds the original values.

| Raw value | Displayed as |
|---|---|
| `67.30` (expense) | `-67,30 €` |
| `-50.00` (refund) | `+50,00 €` |
| `0` | `0,00 €` |

### Usage

```ts
formatLocalizedAmount(67.30, "de-DE", "EUR")  // "-67,30 €"
formatLocalizedAmount(-50,  "de-DE", "EUR")  // "+50,00 €"
```

---

## getAmountDisplayProps

Classifies a formatted amount string and returns all properties needed to render it — both the visual styling (expense/credit color) and the accessible description (aria-label).

### Signature

```ts
getAmountDisplayProps(formatted: string): AmountDisplayProps
```

### Returns

```ts
type AmountDisplayProps = {
  isExpense: boolean               // true if amount starts with "-"
  isCredit:  boolean               // true if amount starts with "+"
  type:      "expense" | "credit" | "amount"
  absolute:  string                // formatted string with sign stripped
}
```

### Usage

```ts
const { isExpense, isCredit, type, absolute } = getAmountDisplayProps("-67,30 €");
// isExpense → true
// type      → "expense"
// absolute  → "67,30 €"
```

### Note on sign characters

The regex strips both ASCII minus `-` (U+002D) and Unicode minus `−` (U+2212), as `Intl.NumberFormat` may output either depending on the runtime environment.
