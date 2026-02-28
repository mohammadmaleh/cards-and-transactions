import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { BankCard } from "./BankCard"

const REVEAL_DURATION_MS = 30_000

const defaultProps = {
  name: "Private Card",
  cardId: "lkmfkl-mlfkm-dlkfm",
  selected: false,
  onSelect: vi.fn(),
}

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
    writable: true,
  })
})

afterEach(() => {
  vi.useRealTimers()
})

describe("BankCard", () => {
  it("renders the card name", () => {
    render(<BankCard {...defaultProps} />)
    expect(screen.getByText("Private Card")).toBeInTheDocument()
  })

  it("masks the card ID by default", () => {
    render(<BankCard {...defaultProps} />)
    expect(screen.getByText("•••• •••• •••• lkfm")).toBeInTheDocument()
    expect(screen.queryByText("lkmfkl-mlfkm-dlkfm")).not.toBeInTheDocument()
  })

  it("reveals the card ID when show button is clicked", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Show card number" }))
    expect(screen.getByText("lkmfkl-mlfkm-dlkfm")).toBeInTheDocument()
  })

  it("hides the card ID when hide button is clicked after reveal", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Show card number" }))
    await userEvent.click(screen.getByRole("button", { name: "Hide card number" }))
    expect(screen.queryByText("lkmfkl-mlfkm-dlkfm")).not.toBeInTheDocument()
  })

  it("auto-hides the card ID after 30 seconds", () => {
    vi.useFakeTimers()

    render(<BankCard {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: "Show card number" }))
    expect(screen.getByText("lkmfkl-mlfkm-dlkfm")).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(REVEAL_DURATION_MS))

    expect(screen.queryByText("lkmfkl-mlfkm-dlkfm")).not.toBeInTheDocument()
  })

  it("copies the card ID to clipboard when copy button is clicked", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Copy card number" }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("lkmfkl-mlfkm-dlkfm")
  })

  it("shows copied confirmation after copy", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Copy card number" }))
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
  })

  it("calls onSelect when the select button is clicked", async () => {
    const onSelect = vi.fn()
    render(<BankCard {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("button", { name: "Select Private Card" }))
    expect(onSelect).toHaveBeenCalledOnce()
  })

  it("reflects selected state via aria-pressed on the select button", () => {
    render(<BankCard {...defaultProps} selected />)
    expect(screen.getByRole("button", { name: "Select Private Card" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
  })

  it("does not trigger onSelect when action buttons are clicked", async () => {
    const onSelect = vi.fn()
    render(<BankCard {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByRole("button", { name: "Show card number" }))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it("has no accessibility violations when unselected", async () => {
    const { container } = render(<BankCard {...defaultProps} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations when selected", async () => {
    const { container } = render(<BankCard {...defaultProps} selected />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
