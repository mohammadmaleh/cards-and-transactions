import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly cardCarousel: Locator;
  readonly amountFilterInput: Locator;
  readonly filterErrorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cardCarousel = page.getByTestId("card-carousel");
    this.amountFilterInput = page.getByLabel("Amount Filter");
    this.filterErrorMessage = page.getByRole("alert").filter({
      hasText: "Enter a valid amount",
    });
  }

  get transactionList(): Locator {
    return this.page.getByTestId("transaction-list");
  }

  get transactionLoading(): Locator {
    return this.page.getByTestId("transaction-loading");
  }

  get transactionEmpty(): Locator {
    return this.page.getByTestId("transaction-empty");
  }

  get transactionError(): Locator {
    return this.page.getByTestId("transaction-error");
  }

  get skipLink(): Locator {
    return this.page.getByRole("link", { name: "Skip to main content" });
  }

  get pagination(): Locator {
    return this.page.getByRole("navigation", { name: "Pagination" });
  }

  get nextPageButton(): Locator {
    return this.page.getByRole("button", { name: "Go to next page" });
  }

  get previousPageButton(): Locator {
    return this.page.getByRole("button", { name: "Go to previous page" });
  }

  pageButton(n: number): Locator {
    return this.page.getByRole("button", { name: `Page ${n}` });
  }

  cardRadio(cardId: string): Locator {
    return this.page.getByTestId(`card-radio-${cardId}`);
  }

  transactionItems(): Locator {
    return this.transactionList.getByRole("listitem");
  }

  transactionItem(description: string): Locator {
    return this.transactionList
      .getByRole("listitem")
      .filter({ hasText: description });
  }

  async goto(params?: { card?: string; filter?: string }): Promise<void> {
    const searchParams = new URLSearchParams();
    if (params?.card) searchParams.set("card", params.card);
    if (params?.filter) searchParams.set("filter", params.filter);
    const query = searchParams.toString();
    await this.page.goto(query ? `/?${query}` : "/");
  }

  async waitForCardsLoaded(): Promise<void> {
    await expect(this.cardCarousel).toBeVisible();
  }

  async waitForTransactionsLoaded(): Promise<void> {
    await expect(this.transactionLoading).not.toBeVisible({ timeout: 5_000 });
    await expect(
      this.transactionList.or(this.transactionEmpty).or(this.transactionError),
    ).toBeVisible({ timeout: 5_000 });
  }

  async selectCard(cardId: string): Promise<void> {
    await this.cardRadio(cardId).click();
    await this.urlContainsCard(cardId);
  }

  async setFilter(value: string): Promise<void> {
    await this.amountFilterInput.fill(value);
  }

  async clearFilter(): Promise<void> {
    await this.amountFilterInput.fill("");
    await expect(this.page).not.toHaveURL(/filter=/, { timeout: 5_000 });
  }

  async getTransactionCount(): Promise<number> {
    return this.transactionItems().count();
  }

  async cardIsSelected(cardId: string): Promise<void> {
    await expect(this.cardRadio(cardId)).toBeChecked();
  }

  async urlContainsCard(cardId: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`card=${cardId}`));
  }

  async urlContainsFilter(value: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`filter=${value}`));
  }

  async urlHasNoFilter(): Promise<void> {
    await expect(this.page).not.toHaveURL(/filter=/);
  }
}