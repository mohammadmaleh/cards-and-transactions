import { renderHook, act } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { useUrlState } from "./useUrlState";

const wrapper = ({ children }: { children: React.ReactNode }) =>
  MemoryRouter({ children });

describe("useUrlState", () => {
  it("returns the default value when the param is absent", () => {
    const { result } = renderHook(() => useUrlState("card", "default-id"), {
      wrapper,
    });
    expect(result.current[0]).toBe("default-id");
  });

  it("returns empty string as default when no default is provided", () => {
    const { result } = renderHook(() => useUrlState("filter"), { wrapper });
    expect(result.current[0]).toBe("");
  });

  it("updates the value when setter is called", () => {
    const { result } = renderHook(() => useUrlState("card", ""), { wrapper });
    act(() => {
      result.current[1]("card-uuid-123");
    });
    expect(result.current[0]).toBe("card-uuid-123");
  });

  it("removes the param when setter is called with null", () => {
    const { result } = renderHook(() => useUrlState("card", "fallback"), {
      wrapper,
    });
    act(() => {
      result.current[1]("card-uuid-123");
    });
    act(() => {
      result.current[1](null);
    });
    expect(result.current[0]).toBe("fallback");
  });

  it("does not affect other params when updating one key", () => {
    const { result: cardResult } = renderHook(
      () => useUrlState("card", ""),
      { wrapper }
    );
    const { result: filterResult } = renderHook(
      () => useUrlState("filter", ""),
      { wrapper }
    );
    act(() => {
      cardResult.current[1]("card-uuid-123");
    });
    expect(filterResult.current[0]).toBe("");
  });
});
