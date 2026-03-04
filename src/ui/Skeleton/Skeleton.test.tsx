import { render } from "@testing-library/react"
import { axe } from "jest-axe"
import { Skeleton } from "./Skeleton"

describe("Skeleton", () => {
  it("renders a div with animate-pulse", () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })

  it("applies additional className", () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)
    expect(container.firstChild).toHaveClass("h-10", "w-full")
  })

  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<Skeleton />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
