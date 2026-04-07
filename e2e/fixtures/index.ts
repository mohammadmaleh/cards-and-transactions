/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";

type AppFixtures = {
  homePage: HomePage;
  loadedHomePage: HomePage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  loadedHomePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.waitForCardsLoaded();
    await homePage.waitForTransactionsLoaded();
    await use(homePage);
  },
});

export { expect } from "@playwright/test";