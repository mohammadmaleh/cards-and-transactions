import { CardCarousel } from "@/features/cards";
import { AmountFilter, TransactionList } from "@/features/transactions";
import { AppLayout } from "@/ui";
import { type ReactNode } from "react";

function HomePage(): ReactNode {
  return (
    <AppLayout>
      <div className="flex h-full flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="px-4 text-2xl font-bold">Cards and Transactions</h1>
        <section aria-labelledby="cards-heading">
          <h2
            id="cards-heading"
            className="mb-3 px-4 text-sm font-semibold uppercase"
          >
            Your Cards
          </h2>
          <CardCarousel />
        </section>
        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 max-w-2xl">
          <section aria-label="Transaction Filters">
            <div className="max-w-50">
              <AmountFilter />
            </div>
          </section>
          <section
            aria-labelledby="transactions-heading"
            className="flex min-h-0 flex-1 flex-col"
          >
            <h2
              id="transactions-heading"
              className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Recent Transactions
            </h2>
            <TransactionList />
          </section>
        </div>
      </div>
    </AppLayout>
  );
}

export { HomePage };
