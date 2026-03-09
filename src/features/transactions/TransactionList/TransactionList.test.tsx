import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { getTransactions } from "@/services"
import { mockManyTransactions } from "@/test/mocks"
import { renderWithProviders } from "@/test/renderWithProviders"
import { TransactionList } from "./TransactionList"

vi.mock("@/services", async () => {
  const { mockTransactions } = await import("@/test/mocks")
  return {
    getCards: vi.fn().mockResolvedValue([]),
    getTransactions: vi.fn().mockResolvedValue(mockTransactions),
  }
})

describe("TransactionList", () => {
  it("shows a loading skeleton when no card is selected", () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/" })
    expect(
      screen.getByRole("status", { name: "Loading transactions" })
    ).toBeVisible()
  })

  it("renders transactions for the selected card", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible()
      expect(screen.getByText("Snack")).toBeVisible()
    })
  })

  it("filters transactions by minimum absolute amount", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=100",
    })
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible()
      expect(screen.queryByText("Snack")).not.toBeInTheDocument()
    })
  })

  it("includes refunds when their absolute value meets the filter", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=100",
    })
    await waitFor(() => {
      expect(screen.getByText("Refund for Smart Phone")).toBeVisible()
    })
  })

  it("shows a filter empty state when no transactions match the filter", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=9999",
    })
    await waitFor(() => {
      expect(
        screen.getByText("No transactions match your filter. Try a lower amount.")
      ).toBeVisible()
    })
  })

  it("filters only expenses when filter starts with -", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=-100",
    })
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible()
      expect(screen.queryByText("Refund for Smart Phone")).not.toBeInTheDocument()
    })
  })

  it("filters only credits when filter starts with +", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=%2B100",
    })
    await waitFor(() => {
      expect(screen.getByText("Refund for Smart Phone")).toBeVisible()
      expect(screen.queryByText("Food")).not.toBeInTheDocument()
    })
  })

  it("shows an error message when transactions fail to load", async () => {
    vi.mocked(getTransactions).mockRejectedValueOnce(new Error("Network error"))
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load transactions. Please try again.",
      )
    })
  })

  it("shows a message when the card has no transactions", async () => {
    vi.mocked(getTransactions).mockResolvedValueOnce([])
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
    await waitFor(() => {
      expect(
        screen.getByText("No transactions found for this card."),
      ).toBeVisible()
    })
  })

  it("has no accessibility violations with transactions", async () => {
    const { container } = renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1",
    })
    await waitFor(() => expect(screen.getByText("Food")).toBeVisible())
    expect(await axe(container)).toHaveNoViolations()
  })

  it("does not render pagination when transactions fit on one page", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
    await waitFor(() => expect(screen.getByText("Food")).toBeVisible())
    expect(
      screen.queryByRole("navigation", { name: "Pagination" }),
    ).not.toBeInTheDocument()
  })

  describe("pagination", () => {
    beforeEach(() => {
      vi.mocked(getTransactions).mockResolvedValue(mockManyTransactions)
    })

    it("shows only 10 transactions on the first page", async () => {
      renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
      await waitFor(() =>
        expect(screen.getByText("Transaction 1")).toBeVisible(),
      )
      expect(screen.getByText("Transaction 10")).toBeVisible()
      expect(screen.queryByText("Transaction 11")).not.toBeInTheDocument()
    })

    it("renders pagination controls when transactions exceed page size", async () => {
      renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
      await waitFor(() =>
        expect(
          screen.getByRole("navigation", { name: "Pagination" }),
        ).toBeVisible(),
      )
    })

    it("navigating to the next page shows the next set of transactions", async () => {
      const user = userEvent.setup()
      renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
      await waitFor(() =>
        expect(screen.getByText("Transaction 1")).toBeVisible(),
      )
      await user.click(screen.getByRole("button", { name: "Go to next page" }))
      await waitFor(() =>
        expect(screen.getByText("Transaction 11")).toBeVisible(),
      )
      expect(screen.queryByText("Transaction 1")).not.toBeInTheDocument()
    })

    it("navigating back to page 1 shows the first set of transactions", async () => {
      const user = userEvent.setup()
      renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" })
      await waitFor(() =>
        expect(screen.getByText("Transaction 1")).toBeVisible(),
      )
      await user.click(screen.getByRole("button", { name: "Go to next page" }))
      await waitFor(() =>
        expect(screen.getByText("Transaction 11")).toBeVisible(),
      )
      await user.click(
        screen.getByRole("button", { name: "Go to previous page" }),
      )
      await waitFor(() =>
        expect(screen.getByText("Transaction 1")).toBeVisible(),
      )
      expect(screen.queryByText("Transaction 11")).not.toBeInTheDocument()
    })

    it("has no accessibility violations with pagination", async () => {
      const { container } = renderWithProviders(<TransactionList />, {
        initialUrl: "/?card=card-1",
      })
      await waitFor(() =>
        expect(
          screen.getByRole("navigation", { name: "Pagination" }),
        ).toBeVisible(),
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
