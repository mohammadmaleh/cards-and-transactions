import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HomePage } from "./HomePage";

const { card1Transactions, card2Transactions } = vi.hoisted(() => ({
  card1Transactions: [{ id: "t1", description: "Rewe", amount: 67.3 }],
  card2Transactions: [{ id: "t2", description: "Flight to NYC", amount: 3200.0 }],
}));

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([
    { id: "card-1", type: "private" },
    { id: "card-2", type: "business" },
  ]),
  getTransactions: vi.fn().mockImplementation((cardId: string) => {
    if (cardId === "card-1") return Promise.resolve(card1Transactions);
    if (cardId === "card-2") return Promise.resolve(card2Transactions);
    return Promise.resolve([]);
  }),
}));

describe("HomePage — integration", () => {
  it("loads card-1 transactions on initial render", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText("Rewe")).toBeVisible();
    });
    expect(screen.queryByText("Flight to NYC")).not.toBeInTheDocument();
  });

  it("loads card-2 transactions after switching to the business card", async () => {
    renderWithProviders(<HomePage />);
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Business Card" })).toBeVisible(),
    );

    await userEvent.click(screen.getByRole("radio", { name: "Business Card" }));

    await waitFor(() => {
      expect(screen.getByText("Flight to NYC")).toBeVisible();
    });
    expect(screen.queryByText("Rewe")).not.toBeInTheDocument();
  });

  it("resets the filter input when switching cards", async () => {
    renderWithProviders(<HomePage />, { initialUrl: "/?card=card-1&filter=50" });
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Business Card" })).toBeVisible(),
    );
    expect(screen.getByLabelText("Amount Filter")).toHaveValue("50");

    await userEvent.click(screen.getByRole("radio", { name: "Business Card" }));

    await waitFor(() =>
      expect(screen.getByText("Flight to NYC")).toBeVisible(),
    );
    expect(screen.getByLabelText("Amount Filter")).toHaveValue("");
  });

  it("shows all card-2 transactions unfiltered after switching from a filtered card-1 view", async () => {
    renderWithProviders(<HomePage />, { initialUrl: "/?card=card-1&filter=9999" });
    await waitFor(() =>
      expect(
        screen.getByText("No transactions match your filter. Try a lower amount."),
      ).toBeVisible(),
    );

    await userEvent.click(screen.getByRole("radio", { name: "Business Card" }));

    await waitFor(() => {
      expect(screen.getByText("Flight to NYC")).toBeVisible();
    });
    expect(
      screen.queryByText("No transactions match your filter. Try a lower amount."),
    ).not.toBeInTheDocument();
  });
});