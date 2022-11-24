import { useEffect, useState } from "react";
import { Observable } from "rxjs";

export const useObservableState = <T>(
  observable: Observable<T>,
  initialState?: T | (() => T),
) => {
  const [value, setValue] = useState<T | undefined>(initialState);

  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
};
