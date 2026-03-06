import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { store } from "../store";
import { router } from "./router";

export const Providers = (): ReactNode => (
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
