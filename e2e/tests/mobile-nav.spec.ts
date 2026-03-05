import { expect, test } from "../fixtures";

test.describe("Mobile Navigation", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
    await homePage.waitForCardsLoaded();
  });

  test("hamburger menu button is visible on mobile", async ({ homePage }) => {
    const menuButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await expect(menuButton).toBeVisible();
  });

  test("desktop sidebar is not visible on mobile", async ({ homePage }) => {
    const sidebar = homePage.page.getByRole("complementary", {
      name: "Sidebar",
    });
    await expect(sidebar).not.toBeVisible();
  });

  test("navigation menu is hidden before the hamburger is clicked", async ({
    homePage,
  }) => {
    const nav = homePage.page.getByRole("navigation", { name: "Main" });
    await expect(nav).not.toBeVisible();
  });

  test("clicking the hamburger button opens the navigation menu", async ({
    homePage,
  }) => {
    const menuButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await menuButton.click();

    const nav = homePage.page.getByRole("navigation", { name: "Main" });
    await expect(nav).toBeVisible();
  });

  test("open hamburger button exposes aria-expanded=true", async ({
    homePage,
  }) => {
    const menuButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await menuButton.click();

    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  });

  test("clicking the hamburger button again closes the menu", async ({
    homePage,
  }) => {
    const openButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await openButton.click();

    const closeButton = homePage.page.getByRole("button", {
      name: "Close navigation menu",
    });
    await closeButton.click();

    const nav = homePage.page.getByRole("navigation", { name: "Main" });
    await expect(nav).not.toBeVisible();
  });

  test("closed menu button exposes aria-expanded=false", async ({
    homePage,
  }) => {
    const openButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await openButton.click();

    const closeButton = homePage.page.getByRole("button", {
      name: "Close navigation menu",
    });
    await closeButton.click();

    await expect(
      homePage.page.getByRole("button", { name: "Open navigation menu" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  test("clicking a nav link closes the menu", async ({ homePage }) => {
    const menuButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await menuButton.click();

    const cardLink = homePage.page.getByRole("link", { name: /Card/ }).first();
    await cardLink.click();

    const nav = homePage.page.getByRole("navigation", { name: "Main" });
    await expect(nav).not.toBeVisible();
  });
});

test.describe("Desktop Navigation", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("desktop sidebar is visible", async ({ homePage }) => {
    await homePage.goto();
    const sidebar = homePage.page.getByRole("complementary", { name: "Sidebar" });
    await expect(sidebar).toBeVisible();
  });

  test("hamburger menu button is not visible on desktop", async ({
    homePage,
  }) => {
    await homePage.goto();
    const menuButton = homePage.page.getByRole("button", {
      name: "Open navigation menu",
    });
    await expect(menuButton).not.toBeVisible();
  });
});