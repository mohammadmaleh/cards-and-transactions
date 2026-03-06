# Cards & Transactions

DKB Code Factory frontend coding challenge

## Tech Stack

**Core**

- Vite + React 19 + TypeScript
- Redux Toolkit + RTK Query for state management and data fetching
- React Router v7 for routing and URL state persistence
- Tailwind CSS v4 with @tailwindcss/vite plugin

**Design System**

- shadcn/ui
- Lucide React for icons

**Testing & Quality**

- Vitest
- React Testing Library + user-event for component tests
- jest-axe for automated accessibility testing
- Playwright for E2E tests
- Storybook component documentation

## Quick Start

Install dependencies:

```bash
npm install
```

Development server:

```bash
npm run dev
```

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage:

```bash
npm run test:coverage
```

Run E2E tests:

```bash
npm run test:e2e
```

Run E2E tests with UI:

```bash
npm run test:e2e:ui
```

View E2E test report:

```bash
npm run test:e2e:report
```

Launch Storybook:

```bash
npm run storybook
```

Build for production:

```bash
npm run build
```

Lint code:

```bash
npm run lint
```

## Project Structure

```
src/
├── ui/                  # Design system components
│   ├── BankCard/        # Card display component
│   ├── Button/          # Button with variant system (default, outline, ghost, icons)
│   ├── Input/           # Input reusable component
│   ├── Skeleton/        # Loading skeleton
│   └── AppLayout/       # Responsive layout
├── features/
│   ├── cards/
│   │   └── CardCarousel/    # Fieldset-based card selection with radio pattern
│   └── transactions/
│       ├── AmountFilter/    # Reusable Amount filter
│       └── TransactionList/ # Represent transactions list
├── shared/
│   ├── hooks/
│   │   └── useUrlState/     # URL-synced state with bulk update support
│   └── utils/
│       └── amount/          # formatLocalizedAmount
├── services/
│   ├── cards/           # Fetches cards
│   └── transactions/    # Fetches transactions
├── store/
│   ├── cards/           # cardsApi slice
│   └── transactions/    # transactionsApi slice
├── pages/               # Main page
├── types/               # Card, Transaction, CardType definitions
├── data/                # JSON files lives here
├── app/                 # Router config and Redux provider
├── lib/                 # shadcn-managed cn() utility
└── test/                # Test setup

e2e/
├── tests/               # E2E tests
├── pages/               # Page Object Model
├── fixtures/            # Test fixtures and utilities
└── data/                # Test data
```

## Architecture Principles

**Clean Separation of Concerns**

- Components never import JSON directly — all data flows through src/services/
- Features are isolated and reusable
- UI components library is agnostic and contains zero business logic
- Each feature exports its public API through index.ts barrel
- Every component has co-located .test.tsx .stories.tsx

**URL-First State Management**

- Card selection and filter amount persist in URL query parameters
- Filter resets automatically when switching cards
- Shareable URLs maintain full application state
- useUrlState hook provides persistent URL state and supports bulk URL params

**Domain-Separated RTK Query APIs**

- Separate createApi per domain with dedicated reducer paths
- cardsApi and transactionsApi live in their respective store folders
- Each API supports refetchOnFocus and refetchOnReconnect

**Type Safety & Code Quality**

- Strict TypeScript and strong typing

## Key Implementation Decisions

### Data Model

- Card: { id: string (UUID), type: "private" | "business" }
- Transaction: { id: string, amount: number, description: string }

### Amount Formatting & Display

- formatLocalizedAmount() uses Intl.NumberFormat('de-DE', { currency: 'EUR', signDisplay: 'exceptZero' }), it can be dynamic in the future depending on the user's settings
- Sign inversion in display layer: expenses show negative, refunds positive

### Advanced Filter Modes

- Supports absolute and +/- prefixes: "100" will show both negative and positive amounts, "+100" filters credits only, "-100" filters expenses only

### Accessibility (WCAG 2.1 AA+)

- Skip-to-main-content link with sr-only focus styles
- Semantic HTML: fieldset, legend, role="alert", role="status"
- aria-invalid, aria-describedby for form errors
- aria-expanded, aria-controls for mobile menu
- aria-live="polite" for dynamic transaction count
- aria-hidden="true" on decorative elements (Skeleton, icons)
- Focus-visible ring states on all interactive elements
- jest-axe runs in every component test

### Testing Strategy

- Unit: Every component has .test.tsx with jest-axe accessibility check
- Integration: HomePage.integration.test.tsx tests full feature flow
- E2E: 5 Playwright suites with Page Object Model pattern
- Custom renderWithProviders() for Redux-connected components

## What Would Be Improved With More Time

**Features**

- Server-side pagination, currently the transaction can be infinite and it can cause performance issues, a pagination logic should be implemented
- Multi-filter support: category, date range, merchant, transaction type
- Sort options: date, amount, description (ascending/descending)
- Transaction search with debounced input
- Export to CSV/PDF with date range selection
- More cards details like IBAN and CSV, with masking and copy functionalities
- Real API integration with JWT authentication and refresh flow
- Internationalization (i18n) with react-i18next

---

**Repository:** https://github.com/mohammadmaleh/cards-and-transactions

**Note:** I spent more than 4 hours building this project, to be able to show how I would structure a frontend application on enterprise level. I worked around 16 hours on it.

Sorry for the long review :)

**Submitted by:** Mohammad Al Maleh
