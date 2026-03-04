import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { axe } from "jest-axe"
import { AppLayout } from "./AppLayout"

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe("AppLayout", () => {
  it("renders navigation and main content", () => {
    renderWithRouter(<AppLayout><p>Page content</p></AppLayout>)
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument()
    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(screen.getByText("Page content")).toBeInTheDocument()
  })

  it("renders the Karten nav link", () => {
    renderWithRouter(<AppLayout><p>content</p></AppLayout>)
    expect(screen.getByRole("link", { name: "Karten" })).toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = renderWithRouter(<AppLayout><p>content</p></AppLayout>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
