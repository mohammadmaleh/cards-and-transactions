import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { BankCard } from "./BankCard"

describe("BankCard", () => {
  it("renders the card label for private type", () => {
    render(<BankCard type="private" />)
    expect(screen.getByText("Private Card")).toBeVisible()
  })

  it("renders the card label for business type", () => {
    render(<BankCard type="business" />)
    expect(screen.getByText("Business Card")).toBeVisible()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<BankCard type="private" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
