import { useUrlState } from "@/shared/hooks";
import { useGetTransactionsQuery } from "@/store";
import { Skeleton } from "@/ui";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { TransactionItem } from "./TransactionItem/TransactionItem";

const SKELETON_COUNT = 3;
const ITEM_HEIGHT_PX = 58;
const ITEM_GAP_PX = 12;

function TransactionListSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading transactions"
      className="flex flex-col gap-3"
    >
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <Skeleton key={i} className="h-14.5" />
      ))}
    </section>
  );
}

function TransactionList() {
  const [selectedCardId] = useUrlState("card");
  const [filterParam] = useUrlState("filter");
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data: transactions,
    isLoading,
    isError,
  } = useGetTransactionsQuery(selectedCardId, { skip: !selectedCardId });

  const filterValue = filterParam !== "" ? Number(filterParam) : 0;
  const filteredTransactions = (transactions ?? []).filter(
    (t) => Math.abs(t.amount) >= filterValue,
  );

  const virtualizer = useVirtualizer({
    count: filteredTransactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT_PX,
    gap: ITEM_GAP_PX,
    overscan: 3,
  });

  if (!selectedCardId || isLoading) {
    return <TransactionListSkeleton />;
  }

  if (isError) {
    return (
      <p role="alert" className="text-sm text-destructive">
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
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {message}
      </p>
    );
  }

  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {filteredTransactions.length}{" "}
        {filteredTransactions.length === 1 ? "transaction" : "transactions"}{" "}
        shown
      </p>
      <div ref={parentRef} tabIndex={0} className="max-h-120 overflow-y-auto rounded focus-visible:outline-2 focus-visible:outline-sky-400">
        <ul
          aria-label="Transactions"
          className="relative list-none"
          style={{ height: virtualizer.getTotalSize() }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const transaction = filteredTransactions[virtualItem.index];
            return (
              <li
                key={virtualItem.key}
                className="absolute left-0 w-full"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TransactionItem
                  description={transaction.description}
                  amount={transaction.amount}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export { TransactionList };
