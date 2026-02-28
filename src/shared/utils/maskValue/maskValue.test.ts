import { maskValue } from "./maskValue";

describe("maskValue", () => {
  it("shows only the last 4 characters", () => {
    expect(maskValue("abcd-1234-efgh-5678")).toBe("•••• •••• •••• 5678");
  });

  it("works with a short value", () => {
    expect(maskValue("abcd")).toBe("•••• •••• •••• abcd");
  });

  it("uses bullet characters for the masked portion", () => {
    const result = maskValue("any-card-id");
    expect(result.startsWith("••••")).toBe(true);
  });
});
