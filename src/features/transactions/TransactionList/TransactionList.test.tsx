import { getTransactions } from "@/services";
import { renderWithProviders } from "@/test/renderWithProviders";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { TransactionList } from "./TransactionList";

const { mockTransactions } = vi.hoisted(() => ({
  mockTransactions: [
    { id: "t1", description: "Food", amount: 123.88 },
    { id: "t2", description: "Snack", amount: 33.48 },
    { id: "t3", description: "Refund for Smart Phone", amount: -100 },
  ],
}));

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([]),
  getTransactions: vi.fn().mockResolvedValue(mockTransactions),
}));

describe("TransactionList", () => {
  it("shows a loading skeleton when no card is selected", () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/" });
    expect(
      screen.getByRole("status", { name: "Loading transactions" }),
    ).toBeVisible();
  });

  it("renders transactions for the selected card", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible();
      expect(screen.getByText("Snack")).toBeVisible();
    });
  });

  it("filters transactions by minimum absolute amount", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=100",
    });
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible();
      expect(screen.queryByText("Snack")).not.toBeInTheDocument();
    });
  });

  it("includes refunds when their absolute value meets the filter", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=100",
    });
    await waitFor(() => {
      expect(screen.getByText("Refund for Smart Phone")).toBeVisible();
    });
  });

  it("shows a filter empty state when no transactions match the filter", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=9999",
    });
    await waitFor(() => {
      expect(
        screen.getByText(
          "No transactions match your filter. Try a lower amount.",
        ),
      ).toBeVisible();
    });
  });

  it("filters only expenses when filter starts with -", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=-100",
    });
    await waitFor(() => {
      expect(screen.getByText("Food")).toBeVisible();
      expect(
        screen.queryByText("Refund for Smart Phone"),
      ).not.toBeInTheDocument();
    });
  });

  it("filters only credits when filter starts with +", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1&filter=%2B100",
    });
    await waitFor(() => {
      expect(screen.getByText("Refund for Smart Phone")).toBeVisible();
      expect(screen.queryByText("Food")).not.toBeInTheDocument();
    });
  });

  it("shows an error message when transactions fail to load", async () => {
    vi.mocked(getTransactions).mockRejectedValueOnce(
      new Error("Network error"),
    );
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load transactions. Please try again.",
      );
    });
  });

  it("shows a message when the card has no transactions", async () => {
    vi.mocked(getTransactions).mockResolvedValueOnce([]);
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(
        screen.getByText("No transactions found for this card."),
      ).toBeVisible();
    });
  });

  it("has no accessibility violations with transactions", async () => {
    const { container } = renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1",
    });
    await waitFor(() => expect(screen.getByText("Food")).toBeVisible());
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Pagination", () => {
  const manyTransactions = Array.from({ length: 25 }, (_, i) => ({
    id: `t${i + 1}`,
    description: `Transaction ${i + 1}`,
    amount: (i + 1) * 10,
  }));

  beforeEach(() => {
    vi.mocked(getTransactions).mockResolvedValue(manyTransactions);
  });

  it("shows pagination when there are more than 10 transactions", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeVisible();
    });
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("shows only 10 transactions per page", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeVisible();
      expect(screen.getByText("Transaction 10")).toBeVisible();
      expect(screen.queryByText("Transaction 11")).not.toBeInTheDocument();
    });
  });

  it("navigates to next page when clicking next button", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1",
    });

    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeVisible();
    });

    const nextButton = screen.getByLabelText(/next page/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.queryByText("Transaction 1")).not.toBeInTheDocument();
      expect(screen.getByText("Transaction 11")).toBeVisible();
    });
  });

  it("disables previous button on first page", async () => {
    renderWithProviders(<TransactionList />, { initialUrl: "/?card=card-1" });
    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeVisible();
    });

    const prevButton = screen.getByLabelText(/previous page/i);
    expect(prevButton).toBeDisabled();
  });

  it("disables next button on last page", async () => {
    renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1",
    });

    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeVisible();
    });

    // Go to page 3 (last page)
    const page3Button = screen.getByRole("button", { name: "3" });
    fireEvent.click(page3Button);

    await waitFor(() => {
      expect(screen.getByText("Transaction 21")).toBeVisible();
    });

    const nextButton = screen.getByLabelText(/next page/i);
    expect(nextButton).toBeDisabled();
  });

  it("has no accessibility violations with pagination", async () => {
    const { container } = renderWithProviders(<TransactionList />, {
      initialUrl: "/?card=card-1",
    });
    await waitFor(() => {
      expect(screen.getByText("Transaction 1")).toBeVisible();
    });
    expect(await axe(container)).toHaveNoViolations();
  });
});
