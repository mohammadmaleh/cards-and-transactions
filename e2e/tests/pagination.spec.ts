import { CARDS, TRANSACTIONS } from "../data/constants";
import { expect, test } from "../fixtures";

test.describe("Transaction Pagination", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto({ card: CARDS.PRIVATE_1.id });
    await homePage.waitForCardsLoaded();
    await homePage.waitForTransactionsLoaded();
  });

  test("shows pagination controls when transactions exceed one page", async ({
    homePage,
  }) => {
    await expect(homePage.pagination).toBeVisible();
  });

  test("shows only 10 transactions on the first page", async ({ homePage }) => {
    const count = await homePage.getTransactionCount();
    expect(count).toBe(10);
  });

  test("previous button is disabled on the first page", async ({ homePage }) => {
    await expect(homePage.previousPageButton).toBeDisabled();
  });

  test("next button is enabled on the first page", async ({ homePage }) => {
    await expect(homePage.nextPageButton).toBeEnabled();
  });

  test("navigating to the next page shows the next set of transactions", async ({
    homePage,
  }) => {
    const firstPageItem = TRANSACTIONS[CARDS.PRIVATE_1.id].samples.expense.description;
    await expect(homePage.transactionItem(firstPageItem)).toBeVisible();

    await homePage.nextPageButton.click();
    await homePage.waitForTransactionsLoaded();

    await expect(homePage.transactionItem(firstPageItem)).not.toBeVisible();
    const count = await homePage.getTransactionCount();
    expect(count).toBeGreaterThan(0);
  });

  test("navigating to the last page disables the next button", async ({
    homePage,
  }) => {
    const totalPages = Math.ceil(TRANSACTIONS[CARDS.PRIVATE_1.id].count / 10);
    await homePage.pageButton(totalPages).click();
    await expect(homePage.nextPageButton).toBeDisabled();
  });

  test("previous button is enabled after navigating to page 2", async ({
    homePage,
  }) => {
    await homePage.nextPageButton.click();
    await expect(homePage.previousPageButton).toBeEnabled();
  });

  test("navigating back with previous shows the first page again", async ({
    homePage,
  }) => {
    const firstPageItem = TRANSACTIONS[CARDS.PRIVATE_1.id].samples.expense.description;
    await homePage.nextPageButton.click();
    await homePage.previousPageButton.click();
    await expect(homePage.transactionItem(firstPageItem)).toBeVisible();
  });

  test("switching cards resets pagination to page 1", async ({ homePage }) => {
    await homePage.nextPageButton.click();
    await expect(homePage.pageButton(2)).toHaveAttribute("aria-current", "page");

    await homePage.selectCard(CARDS.BUSINESS_1.id);
    await homePage.waitForTransactionsLoaded();

    await expect(homePage.pagination).not.toBeVisible();
  });

  test("applying a filter that reduces results below page size hides pagination", async ({
    homePage,
  }) => {
    await expect(homePage.pagination).toBeVisible();
    await homePage.setFilter("200");
    await expect(homePage.pagination).not.toBeVisible();
  });
});
