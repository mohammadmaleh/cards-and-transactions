import { render, screen } from "@testing-library/react";
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

  it("has no accessibility violations", async () => {
    const { container } = renderWithRouter(
      <AppLayout>
        <p>content</p>
      </AppLayout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
