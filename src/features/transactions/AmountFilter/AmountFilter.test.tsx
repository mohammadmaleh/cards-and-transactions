import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { renderWithProviders } from "@/test/renderWithProviders"
import { AmountFilter } from "./AmountFilter"

describe("AmountFilter", () => {
  it("renders the label and input", () => {
    renderWithProviders(<AmountFilter />)
    expect(screen.getByLabelText("Amount Filter")).toBeVisible()
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

  it("accepts a negative prefix as an expense filter", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "-100")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("accepts a positive prefix as a credit filter", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "+100")
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("shows an error for non-numeric input", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "abc")
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid amount (e.g. 100, -100, +100)"
    )
  })

  it("clears the error when input is cleared", async () => {
    renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "abc")
    expect(screen.getByRole("alert")).toBeVisible()
    await userEvent.clear(screen.getByLabelText("Amount Filter"))
    expect(screen.queryByRole("alert")).not.toBeInTheDocument()
  })

  it("has no accessibility violations in default state", async () => {
    const { container } = renderWithProviders(<AmountFilter />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no accessibility violations in error state", async () => {
    const { container } = renderWithProviders(<AmountFilter />)
    await userEvent.type(screen.getByLabelText("Amount Filter"), "abc")
    expect(await axe(container)).toHaveNoViolations()
  })
})
