export const CARDS = {
  PRIVATE_1: {
    id: "a1b2c3d4-0001-4e5f-8a9b-c0d1e2f30001",
    type: "private" as const,
    label: "Private Card",
    iban: "DE89 3704 0044 0532 0130 00",
  },
  BUSINESS_1: {
    id: "a1b2c3d4-0002-4e5f-8a9b-c0d1e2f30002",
    type: "business" as const,
    label: "Business Card",
    iban: "DE12 5004 0000 0600 0178 00",
  },
  PRIVATE_2: {
    id: "a1b2c3d4-0003-4e5f-8a9b-c0d1e2f30003",
    type: "private" as const,
    label: "Private Card",
    iban: "DE91 1004 0000 0123 4567 89",
  },
  BUSINESS_2: {
    id: "a1b2c3d4-0004-4e5f-8a9b-c0d1e2f30004",
    type: "business" as const,
    label: "Business Card",
    iban: "DE75 7002 0070 0010 1111 11",
  },
} as const;

export const TRANSACTIONS = {
  [CARDS.PRIVATE_1.id]: {
    count: 25,
    samples: {
      expense: { description: "Rewe", rawAmount: 67.3 },
      credit: { description: "Ticket Refund", rawAmount: -50.0 },
      large: { description: "Lufthansa Ticket", rawAmount: 288.0 },
      small: { description: "Netflix", rawAmount: 9.99 },
    },
  },
  [CARDS.BUSINESS_1.id]: {
    count: 8,
    samples: {
      expense: { description: "Hotel Berlin", rawAmount: 219.0 },
      credit: { description: "Hotel Refund", rawAmount: -219.0 },
      large: { description: "Flight to NYC", rawAmount: 3200.0 },
      small: { description: "DB Ticket", rawAmount: 14.5 },
    },
  },
  [CARDS.PRIVATE_2.id]: {
    count: 7,
    samples: {
      expense: { description: "Zalando", rawAmount: 120.0 },
      credit: { description: "Zalando Rückgabe", rawAmount: -120.0 },
      large: { description: "iPhone Case", rawAmount: 350.0 },
      small: { description: "Kaffee & Co", rawAmount: 6.8 },
    },
  },
  [CARDS.BUSINESS_2.id]: {
    count: 7,
    samples: {
      expense: { description: "AWS Invoice", rawAmount: 980.0 },
      credit: { description: "Trade Fair Refund", rawAmount: -430.0 },
      large: { description: "Figma Enterprise", rawAmount: 1250.0 },
      small: { description: "Office Supplies", rawAmount: 18.9 },
    },
  },
} as const;