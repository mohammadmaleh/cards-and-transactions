import { useUrlState } from "@/shared/hooks";
import { useGetTransactionsQuery } from "@/store";
import { Skeleton } from "@/ui";
import { useMemo, type ReactNode } from "react";
import { useDebounce } from "use-debounce";
import { TransactionItem } from "./TransactionItem/TransactionItem";

type FilterMode = "all" | "expenses" | "credits"

function parseFilterParam(param: string): { mode: FilterMode; threshold: number } {
  if (!param) return { mode: "all", threshold: 0 }
  if (param.startsWith("+")) return { mode: "credits", threshold: Number(param.slice(1)) }
  if (param.startsWith("-")) return { mode: "expenses", threshold: Number(param.slice(1)) }
  return { mode: "all", threshold: Number(param) }
}

function TransactionListSkeleton(): ReactNode {
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
  const [debouncedCardId] = useDebounce(selectedCardId, 300);

  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetTransactionsQuery(debouncedCardId, {
    skip: !debouncedCardId,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const { mode, threshold } = parseFilterParam(filterParam)
  const filteredTransactions = useMemo(
    () =>
      (transactions ?? []).filter((t) => {
        if (Math.abs(t.amount) < threshold) return false
        if (mode === "expenses") return t.amount > 0
        if (mode === "credits") return t.amount < 0
        return true
      }),
    [transactions, mode, threshold],
  );

  if (!debouncedCardId || isLoading) {
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
      filterParam !== ""
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