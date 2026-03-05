import type { Transaction } from "@/types";
import transactionsData from "@/data/transactions.json";

const transactionsMap = transactionsData as Record<
  string,
  Transaction[] | undefined
>;

export const getTransactions = (cardId: string): Promise<Transaction[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(transactionsMap[cardId] ?? []), 300);
  });
