import { Preferences } from "@capacitor/preferences";
import { useCallback, useEffect, useState } from "react";

export const usePreference = <T extends string = string>(
  key: string,
  defaultValue?: T,
): [T | undefined, (newValue: string) => Promise<void>, boolean] => {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

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
      setLoaded(true);
    })();
  }, [key]);

  return [value, setPreference, loaded];
};
