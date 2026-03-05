import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { MemoryRouter } from "react-router";
import { SidebarNav } from "./SidebarNav";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("SidebarNav", () => {
  it("renders the Card nav link", () => {
    renderWithRouter(<SidebarNav />);
    expect(screen.getByRole("link", { name: /card/i })).toBeVisible();
  });

  it("calls onNavigate when a link is clicked", async () => {
    const onNavigate = vi.fn();
    renderWithRouter(<SidebarNav onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole("link", { name: /card/i }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = renderWithRouter(<SidebarNav />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
