import { useSearchParams } from "react-router";

export const useUrlState = (
  key: string,
  defaultValue: string = ""
): [string, (value: string | null) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = searchParams.get(key) ?? defaultValue;

  const setValue = (newValue: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newValue === null) {
        next.delete(key);
      } else {
        next.set(key, newValue);
      }
      return next;
    });
  };

  return [value, setValue];
};
