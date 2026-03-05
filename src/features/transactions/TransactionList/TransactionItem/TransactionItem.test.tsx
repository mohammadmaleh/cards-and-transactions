import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { TransactionItem } from "./TransactionItem"

describe("TransactionItem", () => {
  it("renders the description", () => {
    render(<ul><TransactionItem description="Food" amount={123.88} /></ul>)
    expect(screen.getByText("Food")).toBeInTheDocument()
  })

  it("renders the formatted amount for an expense", () => {
    render(<ul><TransactionItem description="Food" amount={123.88} /></ul>)
    expect(screen.getByText("-123,88 €")).toBeInTheDocument()
  })

  it("renders the formatted amount for a refund", () => {
    render(<ul><TransactionItem description="Refund" amount={-100} /></ul>)
    expect(screen.getByText("+100,00 €")).toBeInTheDocument()
  })

  it("announces expense type and amount via aria-label", () => {
    render(<ul><TransactionItem description="Food" amount={123.88} /></ul>)
    expect(
      screen.getByRole("listitem", { name: /Food, expense/ }),
    ).toBeInTheDocument()
  })

  it("announces credit type and amount via aria-label", () => {
    render(<ul><TransactionItem description="Refund" amount={-100} /></ul>)
    expect(
      screen.getByRole("listitem", { name: /Refund, credit/ }),
    ).toBeInTheDocument()
  })

  it("has no accessibility violations for an expense", async () => {
    const { container } = render(
      <ul><TransactionItem description="Food" amount={123.88} /></ul>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations for a refund", async () => {
    const { container } = render(
      <ul><TransactionItem description="Refund" amount={-100} /></ul>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})