import { CardCarousel } from "@/features/cards";
import { AmountFilter, TransactionList } from "@/features/transactions";
import { useUrlState } from "@/shared/hooks";
import { AppLayout } from "@/ui";

function HomePage() {
  const [selectedCardId] = useUrlState("card");

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 py-8">
        <h1 className="sr-only">Cards and Transactions</h1>
        <CardCarousel />
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-4">
          <section aria-label="Transaction Filters">
            <AmountFilter key={selectedCardId} />
          </section>
          <TransactionList />
        </div>
      </div>
    </AppLayout>
  );
}

export { HomePage };
