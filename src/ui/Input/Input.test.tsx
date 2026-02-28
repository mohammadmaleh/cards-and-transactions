import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Input } from "./Input"

describe("Input", () => {
  it("renders with a visible label", () => {
    render(<Input id="amount" label="Amount Filter" />)
    expect(screen.getByLabelText("Amount Filter")).toBeInTheDocument()
  })

  it("associates label with input via htmlFor and id", () => {
    render(<Input id="amount" label="Amount Filter" />)
    const input = screen.getByRole("textbox", { name: "Amount Filter" })
    expect(input).toHaveAttribute("id", "amount")
  })

  it("calls onChange when user types", async () => {
    const onChange = vi.fn()
    render(<Input id="amount" label="Amount Filter" onChange={onChange} />)
    await userEvent.type(screen.getByRole("textbox"), "50")
    expect(onChange).toHaveBeenCalled()
  })

  it("shows error message when errorMessage is provided", () => {
    render(
      <Input id="amount" label="Amount Filter" errorMessage="Must be a positive number" />
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Must be a positive number")
  })

  it("marks input as invalid when errorMessage is provided", () => {
    render(
      <Input id="amount" label="Amount Filter" errorMessage="Must be a positive number" />
    )
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })

  it("does not render error markup when errorMessage is absent", () => {
    render(<Input id="amount" label="Amount Filter" />)
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid")
  })

  it("is disabled when disabled prop is set", () => {
    render(<Input id="amount" label="Amount Filter" disabled />)
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("has no accessibility violations in default state", async () => {
    const { container } = render(<Input id="amount" label="Amount Filter" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations in error state", async () => {
    const { container } = render(
      <Input id="amount" label="Amount Filter" errorMessage="Must be a positive number" />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
