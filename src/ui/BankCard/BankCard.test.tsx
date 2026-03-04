import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { BankCard } from "./BankCard"

const REVEAL_DURATION_MS = 30_000

const defaultProps = {
  type: "private" as const,
  iban: "DE89 3704 0044 0532 0130 00",
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
  it("renders the card label derived from type", () => {
    render(<BankCard {...defaultProps} />)
    expect(screen.getByText("Private Card")).toBeInTheDocument()
  })

  it("renders Business Card label for business type", () => {
    render(<BankCard {...defaultProps} type="business" />)
    expect(screen.getByText("Business Card")).toBeInTheDocument()
  })

  it("masks the IBAN by default", () => {
    render(<BankCard {...defaultProps} />)
    expect(screen.getByText("•••• •••• •••• 3000")).toBeInTheDocument()
    expect(screen.queryByText("DE89 3704 0044 0532 0130 00")).not.toBeInTheDocument()
  })

  it("reveals the IBAN when show button is clicked", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Show card number" }))
    expect(screen.getByText("DE89 3704 0044 0532 0130 00")).toBeInTheDocument()
  })

  it("hides the IBAN when hide button is clicked after reveal", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Show card number" }))
    await userEvent.click(screen.getByRole("button", { name: "Hide card number" }))
    expect(screen.queryByText("DE89 3704 0044 0532 0130 00")).not.toBeInTheDocument()
  })

  it("auto-hides the IBAN after 30 seconds", () => {
    vi.useFakeTimers()

    render(<BankCard {...defaultProps} />)
    fireEvent.click(screen.getByRole("button", { name: "Show card number" }))
    expect(screen.getByText("DE89 3704 0044 0532 0130 00")).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(REVEAL_DURATION_MS))

    expect(screen.queryByText("DE89 3704 0044 0532 0130 00")).not.toBeInTheDocument()
  })

  it("copies the IBAN to clipboard when copy button is clicked", async () => {
    render(<BankCard {...defaultProps} />)
    await userEvent.click(screen.getByRole("button", { name: "Copy card number" }))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("DE89 3704 0044 0532 0130 00")
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
