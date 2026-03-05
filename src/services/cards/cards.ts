import cardsData from "@/data/cards.json";
import type { Card } from "@/types";

export const getCards = (): Promise<Card[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(cardsData as Card[]), 300);
  });
