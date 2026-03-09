import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Pagination } from "./Pagination"

describe("Pagination", () => {
  it("renders all page buttons when total pages is small", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByRole("button", { name: `Page ${i}` })).toBeVisible()
    }
  })

  it("marks the current page with aria-current", () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page")
    expect(screen.getByRole("button", { name: "Page 1" })).not.toHaveAttribute("aria-current")
  })

  it("disables Previous on the first page", () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Go to previous page" })).toBeDisabled()
  })

  it("disables Next on the last page", () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />)
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeDisabled()
  })

  it("calls onPageChange with page - 1 when Previous is clicked", async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole("button", { name: "Go to previous page" }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it("calls onPageChange with page + 1 when Next is clicked", async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole("button", { name: "Go to next page" }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("calls onPageChange with the selected page number", async () => {
    const onPageChange = vi.fn()
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole("button", { name: "Page 4" }))
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it("collapses distant pages with ellipsis for large page counts", () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />)
    expect(screen.queryByRole("button", { name: "Page 3" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "Page 8" })).not.toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Page 1" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Page 10" })).toBeVisible()
  })

  it("does not show ellipsis when all pages fit", () => {
    render(<Pagination currentPage={4} totalPages={7} onPageChange={vi.fn()} />)
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByRole("button", { name: `Page ${i}` })).toBeVisible()
    }
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations with ellipsis", async () => {
    const { container } = render(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
