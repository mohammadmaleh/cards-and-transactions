import { cn } from "@/lib/utils";
import { useGetCardsQuery } from "@/store";
import { BankCard, Skeleton } from "@/ui";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";

const CARD_TYPE_LABEL: Record<string, string> = {
  private: "Private Card",
  business: "Business Card",
};

function CardCarouselSkeleton() {
  return (
    <section aria-label="Your cards" aria-busy="true">
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 pt-1">
        {Array.from({ length: 2 }, (_, i) => (
          <Skeleton
            key={i}
            className="aspect-[1.586/1] w-72 shrink-0 rounded-2xl sm:w-90"
          />
        ))}
      </div>
    </section>
  );
}

function CardCarousel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCardId = searchParams.get("card") ?? "";
  const { data: cards, isLoading, isError } = useGetCardsQuery();
  const labelRefs = useRef<Record<string, HTMLLabelElement | null>>({});

  useEffect(() => {
    if (!selectedCardId && cards && cards.length > 0) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("card", cards[0].id);
        return next;
      });
    }
  }, [cards, selectedCardId, setSearchParams]);

  useEffect(() => {
    const el = labelRefs.current[selectedCardId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
  }, [selectedCardId]);

  const handleCardSelect = (cardId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("card", cardId);
      next.delete("filter");
      return next;
    });
  };

  if (isLoading) {
    return <CardCarouselSkeleton />;
  }

  if (isError) {
    return (
      <section aria-label="Your cards">
        <p role="alert" className="px-4 text-sm text-destructive">
          Failed to load cards. Please try again.
        </p>
      </section>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <section aria-label="Your cards">
        <p className="px-4 text-sm text-muted-foreground">No cards available.</p>
      </section>
    );
  }

  return (
    <section>
      <fieldset className="m-0 border-0 p-0">
        <legend className="sr-only">Select a card</legend>
        <div className="flex gap-4 overflow-x-auto px-4 pb-4 pt-1">
          {cards.map((card) => {
            const isSelected = selectedCardId === card.id;
            const cardLabel = CARD_TYPE_LABEL[card.type] ?? card.type;

            return (
              <label
                key={card.id}
                ref={(el) => {
                  labelRefs.current[card.id] = el;
                }}
                className={cn(
                  "block w-72 shrink-0 cursor-pointer rounded-2xl",
                  "focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-400 focus-within:ring-offset-2",
                  isSelected && "ring-2 ring-sky-500 ring-offset-2",
                )}
              >
                <input
                  type="radio"
                  name="card-selection"
                  value={card.id}
                  checked={isSelected}
                  onChange={() => handleCardSelect(card.id)}
                  aria-label={cardLabel}
                  className="sr-only"
                />
                <BankCard type={card.type} />
              </label>
            );
          })}
        </div>
      </fieldset>
    </section>
  );
}

export { CardCarousel };
