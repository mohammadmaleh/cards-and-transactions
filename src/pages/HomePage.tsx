import { CardCarousel } from "@/features/cards";
import { AmountFilter, TransactionList } from "@/features/transactions";
import { useUrlState } from "@/shared/hooks";
import { AppLayout } from "@/ui";

function HomePage() {
  const [selectedCardId] = useUrlState("card");

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 py-8">
        <h1 className="px-4 text-2xl font-bold tracking-tight">Cards and Transactions</h1>
        <section aria-labelledby="cards-heading">
          <h2 id="cards-heading" className="mb-3 px-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Your Cards
          </h2>
          <CardCarousel />
        </section>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4">
          <section aria-label="Transaction Filters">
            <AmountFilter key={selectedCardId} />
          </section>
          <section aria-labelledby="transactions-heading">
            <h2 id="transactions-heading" className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
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
