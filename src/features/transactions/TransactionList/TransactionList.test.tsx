import { screen, waitFor } from "@testing-library/react"
import { axe } from "jest-axe"
import { renderWithProviders } from "@/test/renderWithProviders"
import { TransactionList } from "./TransactionList"

const { mockTransactions } = vi.hoisted(() => ({
  mockTransactions: [
    { id: "t1", description: "Food", amount: 123.88 },
    { id: "t2", description: "Snack", amount: 33.48 },
    { id: "t3", description: "Refund for Smart Phone", amount: -100 },
  ],
}))

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([]),
  getTransactions: vi.fn().mockResolvedValue(mockTransactions),
}))

describe("TransactionList", () => {
  it("shows a loading skeleton when no card is selected", () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/" })
    expect(
      screen.getByRole("status", { name: "Loading transactions" })
    ).toBeInTheDocument()
  })

  it("renders transactions for the selected card", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument()
      expect(screen.getByText("Snack")).toBeInTheDocument()
    })
  })

  it("filters transactions by minimum absolute amount", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=100",
    })
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument()
      expect(screen.queryByText("Snack")).not.toBeInTheDocument()
    })
  })

  it("includes refunds when their absolute value meets the filter", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=100",
    })
    await waitFor(() => {
      expect(screen.getByText("Refund for Smart Phone")).toBeInTheDocument()
    })
  })

  it("shows a filter empty state when no transactions match the filter", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=9999",
    })
    await waitFor(() => {
      expect(
        screen.getByText("No transactions match your filter. Try a lower amount.")
      ).toBeInTheDocument()
    })
  })

  it("has no accessibility violations with transactions", async () => {
    const { container } = renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1",
    })
    await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument())
    expect(await axe(container)).toHaveNoViolations()
  })
})
