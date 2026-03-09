import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HomePage } from "./HomePage";

vi.mock("@/services", async () => {
  const { mockCards, mockCard1Transactions, mockCard2Transactions } = await import("@/test/mocks")
  return {
    getCards: vi.fn().mockResolvedValue(mockCards),
    getTransactions: vi.fn().mockImplementation((cardId: string) => {
      if (cardId === "card-1") return Promise.resolve(mockCard1Transactions);
      if (cardId === "card-2") return Promise.resolve(mockCard2Transactions);
      return Promise.resolve([]);
    }),
  }
});

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

  it("clears the filter URL param and loads unfiltered transactions when switching cards", async () => {
    renderWithProviders(<HomePage />, { initialUrl: "/?card=card-1&filter=50" });
    await waitFor(() =>
      expect(screen.getByRole("radio", { name: "Business Card" })).toBeVisible(),
    );
    expect(screen.getByLabelText("Amount Filter")).toHaveValue("50");

    await userEvent.click(screen.getByRole("radio", { name: "Business Card" }));

    await waitFor(() =>
      expect(screen.getByText("Flight to NYC")).toBeVisible(),
    );
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