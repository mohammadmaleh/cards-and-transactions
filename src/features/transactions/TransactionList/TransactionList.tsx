import { useUrlState } from "@/shared/hooks";
import { useGetTransactionsQuery } from "@/store";
import { Skeleton } from "@/ui";
import type { ReactNode } from "react";
import { TransactionItem } from "./TransactionItem/TransactionItem";

function TransactionListSkeleton() {
  return (
    <section aria-label="Loading transactions" aria-busy="true">
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    </section>
  );
}

const TransactionList = (): ReactNode => {
  const [selectedCardId] = useUrlState("card");
  const [filterParam] = useUrlState("filter");

  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetTransactionsQuery(selectedCardId, { skip: !selectedCardId });

  const filterValue = filterParam !== "" ? Number(filterParam) : 0;
  const filteredTransactions = (transactions ?? []).filter(
    (t) => Math.abs(t.amount) >= filterValue,
  );

  if (!selectedCardId || isLoading) {
    return <TransactionListSkeleton />;
  }

  if (isError) {
    return (
      <section aria-labelledby="transactions-heading">
        <h2 id="transactions-heading" className="sr-only">
          Recent Transactions
        </h2>
        <p role="alert" className="text-sm text-destructive">
          Failed to load transactions. Please try again.
        </p>
      </section>
    );
  }

  if (filteredTransactions.length === 0) {
    const message =
      filterValue > 0
        ? "No transactions match your filter. Try a lower amount."
        : "No transactions found for this card.";

    return (
      <section aria-labelledby="transactions-heading">
        <h2 id="transactions-heading" className="sr-only">
          Recent Transactions
        </h2>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {message}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="transactions-heading">
      <h2 id="transactions-heading" className="sr-only">
        Recent Transactions
      </h2>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredTransactions.length}{" "}
        {filteredTransactions.length === 1 ? "transaction" : "transactions"}{" "}
        shown
      </p>
      <div
        className="max-h-120 overflow-y-auto rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={0}
        role="region"
        aria-label="Transactions"
      >
        <ul className="flex flex-col gap-3 p-0.5">
          {filteredTransactions.map((transaction) => (
            <li key={transaction.id}>
              <TransactionItem
                description={transaction.description}
                amount={transaction.amount}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export { TransactionList };
