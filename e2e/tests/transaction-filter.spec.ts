import { CARDS, TRANSACTIONS } from "../data/constants";
import { expect, test } from "../fixtures";

test.describe("Transaction Filter", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto({ card: CARDS.BUSINESS_1.id });
    await homePage.waitForCardsLoaded();
    await homePage.waitForTransactionsLoaded();
  });

  test("shows all transactions when filter input is empty", async ({
    homePage,
  }) => {
    const count = await homePage.getTransactionCount();
    expect(count).toBe(TRANSACTIONS[CARDS.BUSINESS_1.id].count);
  });

  test("filters out transactions below the minimum amount", async ({
    homePage,
  }) => {
    await homePage.setFilter("219");
    await homePage.waitForTransactionsLoaded();

    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.large.description,
      ),
    ).toBeVisible();
    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.expense.description,
      ),
    ).toBeVisible();

    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.small.description,
      ),
    ).not.toBeVisible();
  });

  test("filter applies to absolute amount — includes matching credits too", async ({
    homePage,
  }) => {
    await homePage.setFilter("219");
    await homePage.waitForTransactionsLoaded();

    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.credit.description,
      ),
    ).toBeVisible();
  });

  test("shows empty state when filter exceeds all transaction amounts", async ({
    homePage,
  }) => {
    await homePage.setFilter("99999");
    await expect(homePage.transactionEmpty).toBeVisible();
    await expect(homePage.transactionEmpty).toContainText(
      "No transactions match your filter",
    );
  });

  test("empty state message suggests lowering the amount", async ({
    homePage,
  }) => {
    await homePage.setFilter("99999");
    await expect(homePage.transactionEmpty).toContainText("Try a lower amount");
  });

  test("clearing the filter restores all transactions", async ({
    homePage,
  }) => {
    await homePage.setFilter("99999");
    await expect(homePage.transactionEmpty).toBeVisible();

    await homePage.clearFilter();
    await homePage.waitForTransactionsLoaded();

    const count = await homePage.getTransactionCount();
    expect(count).toBe(TRANSACTIONS[CARDS.BUSINESS_1.id].count);
  });

  test("negative prefix filters only expenses", async ({ homePage }) => {
    await homePage.setFilter("-219");
    await homePage.waitForTransactionsLoaded();

    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.expense.description,
      ),
    ).toBeVisible();
    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.credit.description,
      ),
    ).not.toBeVisible();
  });

  test("positive prefix filters only credits", async ({ homePage }) => {
    await homePage.setFilter("+219");
    await homePage.waitForTransactionsLoaded();

    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.credit.description,
      ),
    ).toBeVisible();
    await expect(
      homePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.expense.description,
      ),
    ).not.toBeVisible();
  });

  test("shows a validation error for non-numeric input", async ({
    homePage,
  }) => {
    await homePage.setFilter("abc");
    await expect(homePage.filterErrorMessage).toBeVisible();
    await expect(homePage.filterErrorMessage).toContainText(
      "Enter a valid amount",
    );
  });

  test("invalid input does not update the URL filter param", async ({
    homePage,
  }) => {
    await homePage.setFilter("abc");
    await homePage.urlHasNoFilter();
  });

  test("valid filter value updates the URL filter param", async ({
    homePage,
  }) => {
    await homePage.setFilter("100");
    await homePage.urlContainsFilter("100");
  });

  test("filter of zero shows all transactions", async ({ homePage }) => {
    await homePage.setFilter("0");
    await homePage.waitForTransactionsLoaded();

    const count = await homePage.getTransactionCount();
    expect(count).toBe(TRANSACTIONS[CARDS.BUSINESS_1.id].count);
  });

  test("switching cards resets the filter input and shows all transactions for new card", async ({
    homePage,
  }) => {
    await homePage.setFilter("99999");
    await expect(homePage.transactionEmpty).toBeVisible();

    await homePage.selectCard(CARDS.PRIVATE_2.id);

    await homePage.urlContainsCard(CARDS.PRIVATE_2.id);
    await homePage.urlHasNoFilter();

    await homePage.waitForTransactionsLoaded();

    await expect(
      homePage.transactionItem("iPhone Case"),
    ).toBeVisible();

    const count = await homePage.getTransactionCount();
    expect(count).toBe(TRANSACTIONS[CARDS.PRIVATE_2.id].count);

    await expect(homePage.amountFilterInput).toHaveValue("");
  });
});
