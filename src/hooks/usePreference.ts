import { Preferences } from "@capacitor/preferences";
import { useCallback, useEffect, useState } from "react";

export const usePreference = <T extends string = string>(
  key: string,
  defaultValue?: T,
): [T | undefined, (newValue: string) => Promise<void>] => {
  const [value, setValue] = useState(defaultValue);

  const setPreference = useCallback(
    async (newValue: string) => {
      await Preferences.set({ key, value: newValue });
      setValue(newValue as T);
    },
    [key],
  );

  useEffect(() => {
    (async () => {
      const result = await Preferences.get({ key });
      if (result.value) {
        setValue((result.value as T) ?? undefined);
      }
    })();
  }, [key]);

  return [value, setPreference];
};
