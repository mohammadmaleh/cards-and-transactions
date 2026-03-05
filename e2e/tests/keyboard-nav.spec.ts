import { CARDS, TRANSACTIONS } from "../data/constants";
import { expect, test } from "../fixtures";

test.describe("Keyboard Navigation", () => {
  test.describe("Skip link", () => {
    test("skip-to-main-content link is not visible by default", async ({
      homePage,
    }) => {
      await homePage.goto();
      await homePage.waitForCardsLoaded();

      await expect(homePage.skipLink).toBeHidden();
    });

    test("skip-to-main-content link becomes visible on focus", async ({
      homePage,
    }) => {
      await homePage.goto();
      await homePage.waitForCardsLoaded();

      await homePage.skipLink.focus();
      await expect(homePage.skipLink).toBeVisible();
    });

    test("skip link points to the main content landmark", async ({
      homePage,
    }) => {
      await homePage.goto();
      await expect(homePage.skipLink).toHaveAttribute("href", "#main-content");
    });
  });

  test.describe("Card carousel — keyboard selection", () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.goto();
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();
    });

    test("first card radio is focusable via Tab", async ({ homePage }) => {
      await homePage.page.keyboard.press("Tab");
      const firstCardRadio = homePage.cardRadio(CARDS.PRIVATE_1.id);
      await expect(firstCardRadio).toBeFocused();
    });

    test("arrow key moves focus to the next card in the group", async ({
      homePage,
    }) => {
      const firstCardRadio = homePage.cardRadio(CARDS.PRIVATE_1.id);
      await firstCardRadio.focus();
      await homePage.page.keyboard.press("ArrowRight");

      const secondCardRadio = homePage.cardRadio(CARDS.BUSINESS_1.id);
      await expect(secondCardRadio).toBeFocused();
    });

    test("arrow key selects the next card", async ({ homePage }) => {
      const firstCardRadio = homePage.cardRadio(CARDS.PRIVATE_1.id);
      await firstCardRadio.focus();
      await homePage.page.keyboard.press("ArrowRight");

      await homePage.cardIsSelected(CARDS.BUSINESS_1.id);
    });

    test("arrow key selection updates the URL", async ({ homePage }) => {
      const firstCardRadio = homePage.cardRadio(CARDS.PRIVATE_1.id);
      await firstCardRadio.focus();
      await homePage.page.keyboard.press("ArrowRight");

      await homePage.urlContainsCard(CARDS.BUSINESS_1.id);
    });

    test("arrow key selection loads transactions for the new card", async ({
      homePage,
    }) => {
      const firstCardRadio = homePage.cardRadio(CARDS.PRIVATE_1.id);
      await firstCardRadio.focus();
      await homePage.page.keyboard.press("ArrowRight");
      await homePage.waitForTransactionsLoaded();

      const count = await homePage.getTransactionCount();
      expect(count).toBe(TRANSACTIONS[CARDS.BUSINESS_1.id].count);
    });

    test("ArrowLeft moves focus to the previous card", async ({ homePage }) => {
      const secondCardRadio = homePage.cardRadio(CARDS.BUSINESS_1.id);
      await secondCardRadio.focus();
      await homePage.page.keyboard.press("ArrowLeft");

      const firstCardRadio = homePage.cardRadio(CARDS.PRIVATE_1.id);
      await expect(firstCardRadio).toBeFocused();
    });
  });

  test.describe("Amount filter — keyboard interaction", () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.goto();
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();
    });

    test("amount filter input is reachable via Tab", async ({ homePage }) => {
      await homePage.amountFilterInput.focus();
      await expect(homePage.amountFilterInput).toBeFocused();
    });

    test("typing a value in the filter input updates transactions", async ({
      homePage,
    }) => {
      await homePage.amountFilterInput.focus();
      await homePage.amountFilterInput.fill("100");
      await homePage.waitForTransactionsLoaded();

      const count = await homePage.getTransactionCount();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe("Transaction list — keyboard scroll", () => {
    test("transaction list container is focusable", async ({ homePage }) => {
      await homePage.goto({ card: CARDS.PRIVATE_1.id });
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();

      const scrollContainer = homePage.page
        .locator('[tabindex="0"]')
        .filter({ has: homePage.transactionList });
      await scrollContainer.focus();
      await expect(scrollContainer).toBeFocused();
    });
  });
});