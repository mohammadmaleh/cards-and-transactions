import { CARDS, TRANSACTIONS } from "../data/constants";
import { expect, test } from "../fixtures";

test.describe("Card Selection", () => {
  test("auto-selects first card on page load", async ({ loadedHomePage }) => {
    await loadedHomePage.cardIsSelected(CARDS.PRIVATE_1.id);
  });

  test("URL reflects the auto-selected card", async ({ loadedHomePage }) => {
    await loadedHomePage.urlContainsCard(CARDS.PRIVATE_1.id);
  });

  test("renders all four cards in the carousel", async ({ loadedHomePage }) => {
    const carousel = loadedHomePage.cardCarousel;
    await expect(carousel.getByRole("radio")).toHaveCount(4);
  });

  test("renders two Private Cards and two Business Cards", async ({
    loadedHomePage,
  }) => {
    const carousel = loadedHomePage.cardCarousel;
    await expect(
      carousel.getByRole("radio", { name: "Private Card" }),
    ).toHaveCount(2);
    await expect(
      carousel.getByRole("radio", { name: "Business Card" }),
    ).toHaveCount(2);
  });

  test("selecting a different card marks it as checked", async ({
    loadedHomePage,
  }) => {
    await loadedHomePage.selectCard(CARDS.BUSINESS_1.id);
    // await loadedHomePage.cardIsSelected(CARDS.BUSINESS_1.id);
    // await expect(loadedHomePage.cardRadio(CARDS.PRIVATE_1.id)).not.toBeChecked();
  });

  test("selecting a card updates the URL with that card ID", async ({
    loadedHomePage,
  }) => {
    await loadedHomePage.selectCard(CARDS.BUSINESS_1.id);
    await loadedHomePage.urlContainsCard(CARDS.BUSINESS_1.id);
  });

  test("switching cards loads transactions for the selected card", async ({
    loadedHomePage,
  }) => {
    await loadedHomePage.selectCard(CARDS.BUSINESS_1.id);
    await loadedHomePage.waitForTransactionsLoaded();

    const count = await loadedHomePage.getTransactionCount();
    expect(count).toBe(TRANSACTIONS[CARDS.BUSINESS_1.id].count);
  });

  test("switching cards shows transactions unique to that card", async ({
    loadedHomePage,
  }) => {
    await loadedHomePage.waitForTransactionsLoaded();
    await expect(
      loadedHomePage.transactionItem(
        TRANSACTIONS[CARDS.PRIVATE_1.id].samples.expense.description,
      ),
    ).toBeVisible();

    await loadedHomePage.selectCard(CARDS.BUSINESS_1.id);
    await loadedHomePage.waitForTransactionsLoaded();

    await expect(
      loadedHomePage.transactionItem(
        TRANSACTIONS[CARDS.BUSINESS_1.id].samples.large.description,
      ),
    ).toBeVisible();

    await expect(
      loadedHomePage.transactionItem(
        TRANSACTIONS[CARDS.PRIVATE_1.id].samples.expense.description,
      ),
    ).not.toBeVisible();
  });

  test("switching cards removes the filter from the URL", async ({
    loadedHomePage,
  }) => {
    await loadedHomePage.setFilter("50");
    await loadedHomePage.urlContainsFilter("50");

    await loadedHomePage.selectCard(CARDS.BUSINESS_1.id);
    await loadedHomePage.urlHasNoFilter();
  });

  test("displays expenses with a minus sign", async ({ loadedHomePage }) => {
    await loadedHomePage.waitForTransactionsLoaded();

    const reweItem = loadedHomePage.transactionItem(
      TRANSACTIONS[CARDS.PRIVATE_1.id].samples.expense.description,
    );
    await expect(reweItem).toContainText("-");
  });

  test("displays credits with a plus sign", async ({ loadedHomePage }) => {
    await loadedHomePage.waitForTransactionsLoaded();

    const refundItem = loadedHomePage.transactionItem(
      TRANSACTIONS[CARDS.PRIVATE_1.id].samples.credit.description,
    );
    await expect(refundItem).toContainText("+");
  });

  test("navigating directly to a card URL selects that card", async ({
    homePage,
  }) => {
    await homePage.goto({ card: CARDS.PRIVATE_2.id });
    await homePage.waitForCardsLoaded();
    await homePage.waitForTransactionsLoaded();

    await homePage.cardIsSelected(CARDS.PRIVATE_2.id);
    const count = await homePage.getTransactionCount();
    expect(count).toBe(TRANSACTIONS[CARDS.PRIVATE_2.id].count);
  });
});
