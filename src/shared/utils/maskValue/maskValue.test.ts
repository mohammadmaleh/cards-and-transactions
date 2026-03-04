import { maskValue } from "./maskValue";

describe("maskValue", () => {
  it("shows only the last 4 characters of a plain string", () => {
    expect(maskValue("abcd-1234-efgh-5678")).toBe("•••• •••• •••• 5678");
  });

  it("strips spaces before taking last 4 characters", () => {
    expect(maskValue("DE89 3704 0044 0532 0130 00")).toBe("•••• •••• •••• 3000");
  });

  it("works with a short value", () => {
    expect(maskValue("abcd")).toBe("•••• •••• •••• abcd");
  });

  it("uses bullet characters for the masked portion", () => {
    const result = maskValue("DE12 5004 0000 0600 0178 00");
    expect(result.startsWith("••••")).toBe(true);
  });
});
