import { useEffect } from "react";
import { Observable } from "rxjs";

export const useObservableEffect = <T>(
  observable: Observable<T>,
  callback: (value: T) => void,
) => {
  useEffect(() => {
    const subscription = observable.subscribe(callback);
    return () => subscription.unsubscribe();
  }, [callback, observable]);
};
