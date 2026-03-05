import { CARDS, TRANSACTIONS } from "../data/constants";
import { expect, test } from "../fixtures";

test.describe("URL State", () => {
  test.describe("Card selection", () => {
    test("URL gets card param after initial page load", async ({ homePage }) => {
      await homePage.goto();
      await homePage.waitForCardsLoaded();
      await homePage.urlContainsCard(CARDS.PRIVATE_1.id);
    });

    test("direct navigation with card param selects that card", async ({
      homePage,
    }) => {
      await homePage.goto({ card: CARDS.BUSINESS_1.id });
      await homePage.waitForCardsLoaded();
      await homePage.cardIsSelected(CARDS.BUSINESS_1.id);
    });

    test("direct navigation with card param loads that card's transactions", async ({
      homePage,
    }) => {
      await homePage.goto({ card: CARDS.PRIVATE_2.id });
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();

      const count = await homePage.getTransactionCount();
      expect(count).toBe(TRANSACTIONS[CARDS.PRIVATE_2.id].count);
    });

    test("refreshing the page preserves the selected card", async ({
      homePage,
    }) => {
      await homePage.goto({ card: CARDS.BUSINESS_2.id });
      await homePage.waitForCardsLoaded();
      await homePage.cardIsSelected(CARDS.BUSINESS_2.id);

      await homePage.page.reload();
      await homePage.waitForCardsLoaded();
      await homePage.cardIsSelected(CARDS.BUSINESS_2.id);
    });

    test("selecting a card replaces the card param in the URL", async ({
      homePage,
    }) => {
      await homePage.goto({ card: CARDS.PRIVATE_1.id });
      await homePage.waitForCardsLoaded();

      await homePage.selectCard(CARDS.BUSINESS_2.id);
      await homePage.urlContainsCard(CARDS.BUSINESS_2.id);
      await expect(homePage.page).not.toHaveURL(
        new RegExp(`card=${CARDS.PRIVATE_1.id}`),
      );
    });
  });

  test.describe("Filter amount", () => {
    test.beforeEach(async ({ homePage }) => {
      await homePage.goto({ card: CARDS.BUSINESS_1.id });
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();
    });

    test("setting a filter adds the filter param to the URL", async ({
      homePage,
    }) => {
      await homePage.setFilter("150");
      await homePage.urlContainsFilter("150");
    });

    test("clearing the filter removes the filter param from the URL", async ({
      homePage,
    }) => {
      await homePage.setFilter("150");
      await homePage.urlContainsFilter("150");

      await homePage.clearFilter();
      await homePage.urlHasNoFilter();
    });

    test("direct navigation with filter param pre-fills the filter input", async ({
      homePage,
    }) => {
      await homePage.goto({ card: CARDS.BUSINESS_1.id, filter: "200" });
      await homePage.waitForCardsLoaded();
      await expect(homePage.amountFilterInput).toHaveValue("200");
    });

    test("direct navigation with filter param applies the filter immediately", async ({
      homePage,
    }) => {
      await homePage.goto({ card: CARDS.BUSINESS_1.id, filter: "3000" });
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();

      const count = await homePage.getTransactionCount();
      expect(count).toBe(1);
      await expect(
        homePage.transactionItem(
          TRANSACTIONS[CARDS.BUSINESS_1.id].samples.large.description,
        ),
      ).toBeVisible();
    });

    test("refreshing the page preserves the filter value", async ({
      homePage,
    }) => {
      await homePage.setFilter("500");
      await homePage.urlContainsFilter("500");

      await homePage.page.reload();
      await homePage.waitForCardsLoaded();
      await homePage.waitForTransactionsLoaded();

      await expect(homePage.amountFilterInput).toHaveValue("500");
      await homePage.urlContainsFilter("500");
    });

    test("switching cards removes the filter param from the URL", async ({
      homePage,
    }) => {
      await homePage.setFilter("100");
      await homePage.urlContainsFilter("100");

      await homePage.selectCard(CARDS.PRIVATE_1.id);
      await homePage.urlHasNoFilter();
    });
  });
});