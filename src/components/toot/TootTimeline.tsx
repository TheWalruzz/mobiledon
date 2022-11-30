import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Status, WsEvents } from "masto";
import { Toot } from "./Toot";
import { AsyncList } from "../utils/AsyncList";
import { useWebSocketEvent } from "../../hooks/useWebSocketEvent";

interface TootTimelineProps {
  fetchData: (lastFetchedId?: string) => Promise<Status[]>;
  firstItem?: ReactNode;
  eventStream?: WsEvents;
}

export const TootTimeline: FC<TootTimelineProps> = ({
  fetchData,
  firstItem,
  eventStream,
}) => {
  const getId = useCallback((item: Status) => item.id, []);

  const useStream = useMemo(
    () =>
      useWebSocketEvent.bind<
        undefined,
        WsEvents | undefined,
        "update",
        [callback: (item: Status) => void],
        void
      >(this, eventStream, "update"),
    [eventStream],
  );

  const tootItem = useCallback(
    (
      item: Status,
      onUpdate: (id: string, updatedItem: Status) => void,
      onRemove: (id: string) => void,
    ) => <Toot toot={item} onUpdate={onUpdate} onRemove={onRemove} />,
    [],
  );

  return (
    <AsyncList<Status>
      fetchData={fetchData}
      getId={getId}
      firstItem={firstItem}
      useStreamHandler={useStream}
    >
      {tootItem}
    </AsyncList>
  );
};
