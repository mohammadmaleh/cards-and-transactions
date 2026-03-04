import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { renderWithProviders } from "@/test/renderWithProviders"
import { CardCarousel } from "./CardCarousel"

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([
    { id: "card-1", type: "private", iban: "DE89 3704 0044 0532 0130 00" },
    { id: "card-2", type: "business", iban: "DE12 5004 0000 0600 0178 00" },
  ]),
  getTransactions: vi.fn().mockResolvedValue([]),
}))

describe("CardCarousel", () => {
  it("shows a loading skeleton initially", () => {
    renderWithProviders(<CardCarousel />)
    expect(screen.getByRole("region", { name: "Your cards" })).toHaveAttribute(
      "aria-busy",
      "true"
    )
  })

  it("renders all cards after loading", async () => {
    renderWithProviders(<CardCarousel />)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Select Private Card" })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: "Select Business Card" })).toBeInTheDocument()
    })
  })

  it("auto-selects the first card on load", async () => {
    renderWithProviders(<CardCarousel />)
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Select Private Card" })).toHaveAttribute(
        "aria-pressed",
        "true"
      )
    })
  })

  it("selects a card when clicked", async () => {
    renderWithProviders(<CardCarousel />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Select Business Card" })).toBeInTheDocument()
    )
    await userEvent.click(screen.getByRole("button", { name: "Select Business Card" }))
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Select Business Card" })).toHaveAttribute(
        "aria-pressed",
        "true"
      )
      expect(screen.getByRole("button", { name: "Select Private Card" })).toHaveAttribute(
        "aria-pressed",
        "false"
      )
    })
  })

  it("has no accessibility violations after loading", async () => {
    const { container } = renderWithProviders(<CardCarousel />)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Select Private Card" })).toBeInTheDocument()
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
