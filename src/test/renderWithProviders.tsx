import { configureStore } from "@reduxjs/toolkit"
import { render, type RenderOptions } from "@testing-library/react"
import type { ReactElement } from "react"
import { Provider } from "react-redux"
import { MemoryRouter } from "react-router"
import { cardsApi, transactionsApi } from "@/store"

type Options = { initialUrl?: string } & Omit<RenderOptions, "wrapper">

function renderWithProviders(
  ui: ReactElement,
  { initialUrl = "/", ...options }: Options = {}
) {
  const store = configureStore({
    reducer: {
      [cardsApi.reducerPath]: cardsApi.reducer,
      [transactionsApi.reducerPath]: transactionsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(cardsApi.middleware)
        .concat(transactionsApi.middleware),
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialUrl]}>{ui}</MemoryRouter>
    </Provider>,
    options
  )
}

export { renderWithProviders }
