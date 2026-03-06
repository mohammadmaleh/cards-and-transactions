import { useUrlState } from "@/shared/hooks";
import { useGetTransactionsQuery } from "@/store";
import { Skeleton } from "@/ui";
import { useMemo, type ReactNode } from "react";
import { TransactionItem } from "./TransactionItem/TransactionItem";

function TransactionListSkeleton() {
  return (
    <div data-testid="transaction-loading" role="status" aria-label="Loading transactions" aria-busy="true">
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    </div>
  );
}

const TransactionList = (): ReactNode => {
  const [selectedCardId] = useUrlState("card");
  const [filterParam] = useUrlState("filter");

  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetTransactionsQuery(selectedCardId, {
    skip: !selectedCardId,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const filterValue = filterParam !== "" ? Number(filterParam) : 0;
  const filteredTransactions = useMemo(
    () => (transactions ?? []).filter((t) => Math.abs(t.amount) >= filterValue),
    [transactions, filterValue],
  );

  if (!selectedCardId || isLoading) {
    return <TransactionListSkeleton />;
  }

  if (isError) {
    return (
      <p data-testid="transaction-error" role="alert" className="text-sm text-destructive">
        Failed to load transactions. Please try again.
      </p>
    );
  }

  if (filteredTransactions.length === 0) {
    const message =
      filterValue > 0
        ? "No transactions match your filter. Try a lower amount."
        : "No transactions found for this card.";

    return (
      <p data-testid="transaction-empty" className="text-sm text-muted-foreground" aria-live="polite">
        {message}
      </p>
    );
  }

  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredTransactions.length}
        {filteredTransactions.length === 1 ? " transaction " : " transactions "}
        shown
      </p>
      <div
        className="flex-1 min-h-0 overflow-y-auto rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={0}
      >
        <ul data-testid="transaction-list" role="list" className="flex flex-col gap-3 p-0.5">
          {filteredTransactions.map((transaction) => (
            <TransactionItem
              description={transaction.description}
              key={transaction.id}
              amount={transaction.amount}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export { TransactionList };