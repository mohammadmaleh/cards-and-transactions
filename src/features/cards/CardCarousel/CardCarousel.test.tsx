import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { getCards } from "@/services";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CardCarousel } from "./CardCarousel";

vi.mock("@/services", () => ({
  getCards: vi.fn().mockResolvedValue([
    { id: "card-1", type: "private", iban: "DE89 3704 0044 0532 0130 00" },
    { id: "card-2", type: "business", iban: "DE12 5004 0000 0600 0178 00" },
  ]),
  getTransactions: vi.fn().mockResolvedValue([]),
}));

describe("CardCarousel", () => {
  it("shows a loading skeleton initially", () => {
    renderWithProviders(<CardCarousel />);
    expect(screen.getByRole("region", { name: "Your cards" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  });

  it("renders all cards after loading", async () => {
    renderWithProviders(<CardCarousel />);
    await waitFor(() => {
      expect(
        screen.getByRole("radio", { name: "Private Card" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("radio", { name: "Business Card" }),
      ).toBeInTheDocument();
    });
  });

  it("auto-selects the first card on load", async () => {
    renderWithProviders(<CardCarousel />);
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "Private Card" })).toBeChecked();
    });
  });

  it("selects a card when clicked", async () => {
    renderWithProviders(<CardCarousel />);
    await waitFor(() =>
      expect(
        screen.getByRole("radio", { name: "Business Card" }),
      ).toBeInTheDocument(),
    );
    await userEvent.click(screen.getByRole("radio", { name: "Business Card" }));
    await waitFor(() => {
      expect(
        screen.getByRole("radio", { name: "Business Card" }),
      ).toBeChecked();
      expect(
        screen.getByRole("radio", { name: "Private Card" }),
      ).not.toBeChecked();
    });
  });

  it("shows an error message when cards fail to load", async () => {
    vi.mocked(getCards).mockRejectedValueOnce(new Error("Network error"));
    renderWithProviders(<CardCarousel />);
    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Failed to load cards. Please try again.",
      );
    });
  });

  it("shows a message when no cards are available", async () => {
    vi.mocked(getCards).mockResolvedValueOnce([]);
    renderWithProviders(<CardCarousel />);
    await waitFor(() => {
      expect(screen.getByText("No cards available.")).toBeInTheDocument();
    });
  });

  it("has no accessibility violations after loading", async () => {
    const { container } = renderWithProviders(<CardCarousel />);
    await waitFor(() =>
      expect(
        screen.getByRole("radio", { name: "Private Card" }),
      ).toBeInTheDocument(),
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
