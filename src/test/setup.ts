import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { expect, vi } from "vitest";

configure({ asyncUtilTimeout: 3000 });

expect.extend(toHaveNoViolations);

class ResizeObserverMock {
  private callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    const rect = target.getBoundingClientRect()
    this.callback(
      [
        {
          target,
          contentRect: rect,
          borderBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
          contentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
          devicePixelContentBoxSize: [{ inlineSize: rect.width, blockSize: rect.height }],
        } as ResizeObserverEntry,
      ],
      this
    )
  }

  unobserve = vi.fn()
  disconnect = vi.fn()
}

global.ResizeObserver = ResizeObserverMock;

Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
  height: 500,
  width: 600,
  top: 0,
  left: 0,
  bottom: 500,
  right: 600,
  x: 0,
  y: 0,
  toJSON: () => ({}),
});
