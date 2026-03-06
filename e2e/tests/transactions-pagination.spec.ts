import { CARDS } from "../data/constants";
import { expect, test } from "../fixtures";

test.describe("Transaction Pagination", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto({ card: CARDS.PRIVATE_1.id });
    await homePage.waitForCardsLoaded();
    await homePage.waitForTransactionsLoaded();
  });

  test("shows pagination when there are more than 10 transactions", async ({
    page,
  }) => {
    await expect(page.getByRole("navigation")).toBeVisible();
  });

  test("does not show pagination for cards with 10 or fewer transactions", async ({
    homePage,
    page,
  }) => {
    await homePage.selectCard(CARDS.BUSINESS_1.id);
    await homePage.waitForTransactionsLoaded();

    const count = await homePage.getTransactionCount();
    expect(count).toBeLessThanOrEqual(10);

    const nav = page.getByRole("navigation");
    await expect(nav).toBeHidden();
  });

  test("shows only 10 transactions per page", async ({ homePage }) => {
    const count = await homePage.getTransactionCount();
    expect(count).toBe(10);
  });

  test("displays correct page number buttons", async ({ page }) => {
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "3" })).toBeVisible();
  });

  test("navigates to next page when clicking next button", async ({
    page,
    homePage,
  }) => {
    const firstItem = await homePage.transactionItems().first().textContent();

    const nextButton = page.getByLabel(/next page/i);
    await nextButton.click();

    await expect(homePage.transactionItems().first()).not.toContainText(
      firstItem || "",
    );
  });

  test("navigates to previous page when clicking previous button", async ({
    page,
    homePage,
  }) => {
    const nextButton = page.getByLabel(/next page/i);
    await nextButton.click();

    const secondPageFirst = await homePage
      .transactionItems()
      .first()
      .textContent();

    const prevButton = page.getByLabel(/previous page/i);
    await prevButton.click();

    await expect(homePage.transactionItems().first()).not.toContainText(
      secondPageFirst || "",
    );
  });

  test("navigates to specific page when clicking page number", async ({
    page,
    homePage,
  }) => {
    const page3Button = page.getByRole("button", { name: "3" });
    await page3Button.click();

    await expect(page3Button).toHaveAttribute("aria-current", "page");

    const count = await homePage.getTransactionCount();
    expect(count).toBe(5);
  });

  test("disables previous button on first page", async ({ page }) => {
    const prevButton = page.getByLabel(/previous page/i);
    await expect(prevButton).toBeDisabled();
  });

  test("disables next button on last page", async ({ page }) => {
    const page3Button = page.getByRole("button", { name: "3" });
    await page3Button.click();

    await expect(page3Button).toHaveAttribute("aria-current", "page");

    const nextButton = page.getByLabel(/next page/i);
    await expect(nextButton).toBeDisabled();
  });

  test("highlights current page button", async ({ page }) => {
    const page1Button = page.getByRole("button", { name: "1" });
    await expect(page1Button).toHaveAttribute("aria-current", "page");

    const page2Button = page.getByRole("button", { name: "2" });
    await page2Button.click();

    await expect(page2Button).toHaveAttribute("aria-current", "page");
  });

  test("resets to page 1 when filter reduces results", async ({
    page,
    homePage,
  }) => {
    const page2Button = page.getByRole("button", { name: "2" });
    await page2Button.click();
    await expect(page2Button).toHaveAttribute("aria-current", "page");

    await homePage.setFilter("200");
    await homePage.waitForTransactionsLoaded();

    const page1Button = page.getByRole("button", { name: "1" });
    await expect(page1Button).toHaveAttribute("aria-current", "page");
  });

  test("resets to page 1 when switching cards", async ({ page, homePage }) => {
    const page2Button = page.getByRole("button", { name: "2" });
    await page2Button.click();
    await expect(page2Button).toHaveAttribute("aria-current", "page");

    await homePage.selectCard(CARDS.BUSINESS_1.id);
    await homePage.waitForTransactionsLoaded();

    await expect(page.getByRole("navigation")).toBeHidden();
  });
});
