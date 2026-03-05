import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HomePage } from "./HomePage";

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([
    { id: "card-1", type: "private" },
    { id: "card-2", type: "business" },
  ]),
  getTransactions: vi.fn().mockResolvedValue([
    { id: "t1", description: "Food", amount: 123.88 },
    { id: "t2", description: "Snack", amount: 33.48 },
  ]),
}));

describe("HomePage", () => {
  it("renders the card carousel", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(
        screen.getByRole("radio", { name: "Private Card" }),
      ).toBeInTheDocument();
    });
  });

  it("renders the amount filter", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByLabelText("Amount Filter")).toBeInTheDocument();
  });

  it("renders transactions after a card is selected", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
    });
  });

  it("auto-selects the first card and loads its transactions", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Private Card" })).toBeChecked();
      expect(screen.getByText("Food")).toBeInTheDocument();
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<HomePage />);
    await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument());
    expect(await axe(container)).toHaveNoViolations();
  });
});
