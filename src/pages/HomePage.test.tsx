import { screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { getTransactions } from "@/services";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HomePage } from "./HomePage";

vi.mock("@/services", async () => {
  const { mockCards, mockTransactions } = await import("@/test/mocks")
  return {
    getCards: vi.fn().mockResolvedValue(mockCards),
    getTransactions: vi.fn().mockResolvedValue(mockTransactions),
  }
});

describe("HomePage", () => {
  it("renders the card carousel", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(
        screen.getByRole("radio", { name: "Private Card" }),
      ).toBeVisible();
    });
  });

  it("renders the amount filter once a card with transactions is selected", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByLabelText("Amount Filter")).toBeVisible();
    });
  });

  it("renders transactions after a card is selected", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible();
    });
  });

  it("auto-selects the first card and loads its transactions", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Private Card" })).toBeChecked();
      expect(screen.getByText("Food")).toBeVisible();
    });
  });

  it("shows the filter and an empty state when the selected card has no transactions", async () => {
    vi.mocked(getTransactions).mockResolvedValueOnce([]);
    renderWithProviders(<HomePage />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(screen.getByLabelText("Amount Filter")).toBeInTheDocument();
      expect(screen.getByText("No transactions found for this card.")).toBeVisible();
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithProviders(<HomePage />);
    await waitFor(() => expect(screen.getByText("Food")).toBeVisible());
    expect(await axe(container)).toHaveNoViolations();
  });
});
