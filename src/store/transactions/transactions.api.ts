import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Transaction } from "@/types/transaction"
import { getTransactions } from "@/services"

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 60,
  endpoints: (builder) => ({
    getTransactions: builder.query<Transaction[], string>({
      queryFn: async (cardId) => {
        const data = await getTransactions(cardId)
        return { data }
      },
    }),
  }),
})

export const { useGetTransactionsQuery } = transactionsApi
