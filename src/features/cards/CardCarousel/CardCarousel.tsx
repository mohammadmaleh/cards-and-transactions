import { useEffect, useRef } from "react"
import { useSearchParams } from "react-router"
import { useVirtualizer } from "@tanstack/react-virtual"
import { BankCard, Skeleton } from "@/ui"
import { useGetCardsQuery } from "@/store"

const CARD_WIDTH_PX = 360
const CARD_HEIGHT_PX = Math.round(CARD_WIDTH_PX / 1.586)
const CARD_GAP_PX = 16
const SKELETON_COUNT = 2

function CardCarouselSkeleton() {
  return (
    <section aria-label="Your cards" aria-busy="true">
      <div className="flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <Skeleton key={i} className="aspect-[1.586/1] min-w-90 shrink-0 rounded-2xl" />
        ))}
      </div>
    </section>
  )
}

function CardCarousel() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCardId = searchParams.get("card") ?? ""
  const { data: cards, isLoading, isError } = useGetCardsQuery()
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: cards?.length ?? 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => CARD_WIDTH_PX,
    horizontal: true,
    gap: CARD_GAP_PX,
    overscan: 2,
  })

  useEffect(() => {
    if (!selectedCardId && cards && cards.length > 0) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set("card", cards[0].id)
        return next
      })
    }
  }, [cards, selectedCardId, setSearchParams])

  const handleCardSelect = (cardId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set("card", cardId)
      next.delete("filter")
      return next
    })
  }

  if (isLoading) {
    return <CardCarouselSkeleton />
  }

  if (isError) {
    return (
      <section aria-label="Your cards">
        <p role="alert" className="text-sm text-destructive">
          Failed to load cards. Please try again.
        </p>
      </section>
    )
  }

  if (!cards || cards.length === 0) {
    return (
      <section aria-label="Your cards">
        <p className="text-sm text-muted-foreground">No cards available.</p>
      </section>
    )
  }

  return (
    <section aria-label="Your cards">
      <div ref={scrollRef} className="overflow-x-auto p-1">
        <div
          className="relative"
          style={{ width: virtualizer.getTotalSize(), height: CARD_HEIGHT_PX }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const card = cards[virtualItem.index]
            return (
              <div
                key={virtualItem.key}
                className="absolute top-0 h-full"
                style={{
                  width: `${virtualItem.size}px`,
                  transform: `translateX(${virtualItem.start}px)`,
                }}
              >
                <BankCard
                  type={card.type}
                  iban={card.iban}
                  selected={selectedCardId === card.id}
                  onSelect={() => handleCardSelect(card.id)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export { CardCarousel }
