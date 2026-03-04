import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { TransactionItem } from "./TransactionItem"

describe("TransactionItem", () => {
  it("renders the description", () => {
    render(<TransactionItem description="Food" amount={123.88} />)
    expect(screen.getByText("Food")).toBeInTheDocument()
  })

  it("renders the formatted amount for an expense", () => {
    render(<TransactionItem description="Food" amount={123.88} />)
    expect(screen.getByText("-123,88 €")).toBeInTheDocument()
  })

  it("renders the formatted amount for a refund", () => {
    render(<TransactionItem description="Refund" amount={-100} />)
    expect(screen.getByText("+100,00 €")).toBeInTheDocument()
  })

  it("labels an expense amount with Expense for screen readers", () => {
    render(<TransactionItem description="Food" amount={123.88} />)
    expect(screen.getByLabelText(/^Expense:/)).toBeInTheDocument()
  })

  it("labels a refund amount with Refund for screen readers", () => {
    render(<TransactionItem description="Refund" amount={-100} />)
    expect(screen.getByLabelText(/^Refund:/)).toBeInTheDocument()
  })

  it("has no accessibility violations for an expense", async () => {
    const { container } = render(<TransactionItem description="Food" amount={123.88} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations for a refund", async () => {
    const { container } = render(<TransactionItem description="Refund" amount={-100} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
