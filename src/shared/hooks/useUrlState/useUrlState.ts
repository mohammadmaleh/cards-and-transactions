import { useSearchParams } from "react-router";

export const useUrlState = (
  key: string,
  defaultValue: string = ""
): [string, (updates: Record<string, string | null>) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key) ?? defaultValue;

  const setValue = (updates: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      for (const [k, v] of Object.entries(updates)) {
        if (v === null) next.delete(k);
        else next.set(k, v);
      }
      return next;
    });
  };

  return [value, setValue];
};
