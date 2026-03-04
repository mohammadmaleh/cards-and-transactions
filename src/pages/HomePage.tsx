import { useUrlState } from "@/shared/hooks"
import { AppLayout } from "@/ui"
import { CardCarousel } from "@/features/cards"
import { AmountFilter, TransactionList } from "@/features/transactions"

function HomePage() {
  const [selectedCardId] = useUrlState("card")

  return (
    <AppLayout>
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-8">
        <h1 className="sr-only">Cards and Transactions</h1>
        <CardCarousel />
        <section aria-label="Transactions" className="flex flex-col gap-4">
          <AmountFilter key={selectedCardId} />
          <TransactionList />
        </section>
      </div>
    </AppLayout>
  )
}

export { HomePage }
