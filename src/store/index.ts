import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { cardsApi } from "./cards/cards.api";
import { transactionsApi } from "./transactions/transactions.api";

export const store = configureStore({
  reducer: {
    [cardsApi.reducerPath]: cardsApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(cardsApi.middleware)
      .concat(transactionsApi.middleware),
});

setupListeners(store.dispatch);

export { cardsApi, useGetCardsQuery } from "./cards/cards.api";
export {
  transactionsApi,
  useGetTransactionsQuery,
} from "./transactions/transactions.api";
