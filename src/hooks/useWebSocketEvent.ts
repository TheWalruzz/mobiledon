import { EventTypeMap, WsEvents } from "masto";
import { useEffect } from "react";

export const useWebSocketEvent = <T extends keyof EventTypeMap>(
  source: WsEvents | undefined,
  eventName: T,
  callback: (...value: EventTypeMap[T]) => void,
) => {
  useEffect(() => {
    source?.on(eventName, callback);
    return () => {
      source?.off(eventName, callback);
    };
  }, [callback, eventName, source]);
};
