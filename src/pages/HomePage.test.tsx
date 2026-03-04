import { screen, waitFor } from "@testing-library/react"
import { axe } from "jest-axe"
import { renderWithProviders } from "@/test/renderWithProviders"
import { HomePage } from "./HomePage"

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([
    { id: "card-1", type: "private", iban: "DE89 3704 0044 0532 0130 00" },
    { id: "card-2", type: "business", iban: "DE12 5004 0000 0600 0178 00" },
  ]),
  getTransactions: vi.fn().mockResolvedValue([
    { id: "t1", description: "Food", amount: 123.88 },
    { id: "t2", description: "Snack", amount: 33.48 },
  ]),
}))

describe("HomePage", () => {
  it("renders the card carousel", async () => {
    renderWithProviders(<HomePage />)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Select Private Card" })).toBeInTheDocument()
    })
  })

  it("renders the amount filter", () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByLabelText("Amount Filter")).toBeInTheDocument()
  })

  it("renders transactions after a card is selected", async () => {
    renderWithProviders(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument()
    })
  })

  it("auto-selects the first card and loads its transactions", async () => {
    renderWithProviders(<HomePage />)
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Select Private Card" })
      ).toHaveAttribute("aria-pressed", "true")
      expect(screen.getByText("Food")).toBeInTheDocument()
    })
  })

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<HomePage />)
    await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument())
    expect(await axe(container)).toHaveNoViolations()
  })
})
