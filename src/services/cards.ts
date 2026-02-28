import type { Card } from "../types";
import cardsData from "../data/cards.json";

export const getCards = (): Promise<Card[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(cardsData), 300);
  });
