import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { Status, WsEvents } from "masto";
import { Toot } from "../toot/Toot";
import { AsyncList } from "../utils/AsyncList";
import { useWebSocketEvent } from "../../hooks/useWebSocketEvent";

interface StatusTimelineProps {
  fetchData: (lastFetchedId?: string) => Promise<Status[]>;
  firstItem?: ReactNode;
  eventStream?: WsEvents;
}

export const StatusTimeline: FC<StatusTimelineProps> = ({
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

  return (
    <AsyncList<Status>
      fetchData={fetchData}
      getId={getId}
      firstItem={firstItem}
      useStreamHandler={useStream}
    >
      {(item, onUpdate, onRemove) => (
        <Toot toot={item} onUpdate={onUpdate} onRemove={onRemove} />
      )}
    </AsyncList>
  );
};
