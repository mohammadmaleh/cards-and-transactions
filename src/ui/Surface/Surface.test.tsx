import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { Surface } from "./Surface"

describe("Surface", () => {
  describe("static (non-interactive)", () => {
    it("renders its children", () => {
      render(<Surface>Content</Surface>)
      expect(screen.getByText("Content")).toBeInTheDocument()
    })

    it("renders as a div", () => {
      render(<Surface data-testid="surface">Content</Surface>)
      expect(screen.getByTestId("surface").tagName).toBe("DIV")
    })

    it("has no accessibility violations", async () => {
      const { container } = render(<Surface>Content</Surface>)
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe("interactive", () => {
    it("renders as a button", () => {
      render(
        <Surface interactive onClick={vi.fn()} aria-label="Select card">
          Content
        </Surface>
      )
      expect(screen.getByRole("button")).toBeInTheDocument()
    })

    it("calls onClick when clicked", async () => {
      const onClick = vi.fn()
      render(
        <Surface interactive onClick={onClick} aria-label="Select card">
          Content
        </Surface>
      )
      await userEvent.click(screen.getByRole("button"))
      expect(onClick).toHaveBeenCalledOnce()
    })

    it("reflects selected state via aria-pressed", () => {
      render(
        <Surface interactive selected onClick={vi.fn()} aria-label="Select card">
          Content
        </Surface>
      )
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true")
    })

    it("reflects unselected state via aria-pressed false", () => {
      render(
        <Surface interactive selected={false} onClick={vi.fn()} aria-label="Select card">
          Content
        </Surface>
      )
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false")
    })

    it("has no accessibility violations when unselected", async () => {
      const { container } = render(
        <Surface interactive selected={false} onClick={vi.fn()} aria-label="Select card">
          Content
        </Surface>
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it("has no accessibility violations when selected", async () => {
      const { container } = render(
        <Surface interactive selected onClick={vi.fn()} aria-label="Select card">
          Content
        </Surface>
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
