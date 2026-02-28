import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Card } from "../../types/card";
import { getCards } from "../../services";

export const cardsApi = createApi({
  reducerPath: "cardsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getCards: builder.query<Card[], void>({
      queryFn: async () => {
        const data = await getCards();
        return { data };
      },
    }),
  }),
});

export const { useGetCardsQuery } = cardsApi;
