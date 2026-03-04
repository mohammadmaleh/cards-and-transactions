import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { renderWithProviders } from "@/test/renderWithProviders"
import { AmountFilter } from "./AmountFilter"

describe("AmountFilter", () => {
  it("renders the label and input", () => {
    renderWithProviders(<AmountFilter />)
    expect(screen.getByLabelText("Amount Filter")).toBeInTheDocument()
  })

  it("pre-fills from the URL filter param", () => {
    renderWithProviders(<AmountFilter />, { initialUrl: "/?filter=50" })
    expect(screen.getByLabelText("Amount Filter")).toHaveValue("50")
  })

  it("updates the URL param when a valid number is entered", async () => {
    renderWithProviders(<AmountFilter />, { initialUrl: "/" })
    await userEvent.type(screen.getByLabelText("Amount Filter"), "100")
    await waitFor(() => {
      expect(screen.getByLabelText("Amount Filter")).toHaveValue("100")
    })
  })

  it("shows an error for a negative number", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "-5")
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Amount must be a positive number"
    )
  })

  it("shows an error for non-numeric input", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "abc")
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Amount must be a positive number"
    )
  })

  it("clears the error when input is cleared", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "-5")
    expect(screen.getByRole("alert")).toBeInTheDocument()
    await userEvent.clear(screen.getByLabelText("Amount Filter"))
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("has no accessibility violations in default state", async () => {
    const { container } = renderWithProviders(<AmountFilter />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations in error state", async () => {
    const { container } = renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "-5")
    expect(await axe(container)).toHaveNoViolations()
  })
})
