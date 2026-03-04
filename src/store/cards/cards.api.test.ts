import { cardsApi } from "./cards.api"

describe("cardsApi", () => {
  it("has the correct reducer path", () => {
    expect(cardsApi.reducerPath).toBe("cardsApi")
  })

  it("exposes a getCards endpoint", () => {
    expect(cardsApi.endpoints).toHaveProperty("getCards")
  })
})
