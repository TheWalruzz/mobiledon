import { WsEvents } from "masto";
import { useEffect, useRef } from "react";
import { fromEvent, Subscription } from "rxjs";

export const useWebSocketEvent = <T = any>(
  source: WsEvents | undefined,
  eventName: string,
  callback: (value: T) => void,
) => {
  const subscription = useRef<Subscription>();

  useEffect(() => {
    if (source) {
      subscription.current = fromEvent(source, eventName).subscribe(
        callback as (value: unknown) => void,
      );
    }
    return () => subscription.current?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
