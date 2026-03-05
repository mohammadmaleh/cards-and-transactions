import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router";
import { AppLayout } from "./AppLayout";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("AppLayout", () => {
  it("renders navigation and main content", () => {
    renderWithRouter(
      <AppLayout>
        <p>Page content</p>
      </AppLayout>,
    );
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeVisible();
    expect(screen.getByRole("main")).toBeVisible();
    expect(screen.getByText("Page content")).toBeVisible();
  });

  it("skip link is present in the DOM", () => {
    renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toBeInTheDocument();
  });

  it("skip link points to the main content landmark", () => {
    renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    expect(
      screen.getByRole("link", { name: "Skip to main content" }),
    ).toHaveAttribute("href", "#main-content");
  });

  it("hamburger button is present with aria-expanded=false initially", () => {
    renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("opens the mobile navigation menu when the hamburger is clicked", async () => {
    renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(1);

    await userEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );

    expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Close navigation menu" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("closes the mobile navigation menu when the hamburger is clicked again", async () => {
    renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Close navigation menu" }),
    );

    expect(screen.getAllByRole("navigation", { name: "Main" })).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
