import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { List, ListItem } from "./List"

describe("List", () => {
  it("renders as a ul element", () => {
    render(<List aria-label="Transactions" />)
    expect(screen.getByRole("list")).toBeInTheDocument()
  })

  it("renders children", () => {
    render(
      <List>
        <ListItem>Food — -€123,88</ListItem>
        <ListItem>Snack — -€33,48</ListItem>
      </List>
    )
    expect(screen.getAllByRole("listitem")).toHaveLength(2)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <List aria-label="Transactions">
        <ListItem>Food — -€123,88</ListItem>
        <ListItem>Snack — -€33,48</ListItem>
      </List>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("ListItem", () => {
  it("renders as a li element", () => {
    render(
      <ul>
        <ListItem>Content</ListItem>
      </ul>
    )
    expect(screen.getByRole("listitem")).toBeInTheDocument()
  })

  it("renders its children", () => {
    render(
      <ul>
        <ListItem>Transaction content</ListItem>
      </ul>
    )
    expect(screen.getByText("Transaction content")).toBeInTheDocument()
  })
})
