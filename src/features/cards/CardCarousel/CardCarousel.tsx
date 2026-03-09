import { cn } from "@/lib/utils";
import { CARD_TYPE_LABEL } from "@/shared/constants";
import { useUrlState } from "@/shared/hooks";
import { useGetCardsQuery } from "@/store";
import { BankCard, Skeleton } from "@/ui";
import { useEffect, type ReactNode } from "react";

function CardCarousel(): ReactNode {
  const [selectedCardId, setCardParams] = useUrlState("card");
  const { data: cards, isLoading, isError } = useGetCardsQuery(undefined);

  useEffect(() => {
    if (!selectedCardId && cards && cards.length > 0) {
      setCardParams({ card: cards[0].id });
    }
  }, [cards, selectedCardId, setCardParams]);

  if (isLoading) {
    return (
      <div aria-hidden="true" className="flex gap-4 overflow-x-auto px-4 pb-4 pt-1">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton key={i} className="aspect-[1.586/1] w-72 shrink-0 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="px-4 text-sm text-destructive">
        Failed to load cards. Please try again.
      </p>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <p className="px-4 text-sm text-muted-foreground">No cards available.</p>
    );
  }

  return (
    <fieldset data-testid="card-carousel" className="border-0 p-0 m-0">
      <legend className="sr-only">Select a card</legend>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 pt-1">
        {cards.map((card) => {
          const isSelected = selectedCardId === card.id;
          return (
            <div
              key={card.id}
              className={cn(
                "relative w-72 shrink-0 rounded-2xl",
                isSelected && "ring-2 ring-sky-500 ring-offset-2",
              )}
            >
              <div aria-hidden="true">
                <BankCard type={card.type} />
              </div>
              <label
                className={cn(
                  "absolute inset-0 cursor-pointer rounded-2xl",
                  "focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2",
                )}
              >
                <span className="sr-only">{CARD_TYPE_LABEL[card.type]}</span>
                <input
                  data-testid={`card-radio-${card.id}`}
                  type="radio"
                  name="card-selection"
                  value={card.id}
                  checked={isSelected}
                  onChange={() => setCardParams({ card: card.id, filter: null })}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export { CardCarousel };
