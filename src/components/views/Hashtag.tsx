import { WsEvents } from "masto";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../../config";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { filterDefinedKeys } from "../../utils/filterObject";
import { Timeline } from "../layout/Timeline";

export const Hashtag = () => {
  const { setCurrentTimeline, apiClient } = useAppContext();
  const { name } = useParams();
  const [eventStream, setEventStream] = useState<WsEvents>();

  useEffect(() => {
    setCurrentTimeline(TimelineType.Hashtag);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      const response = await apiClient.timelines.fetchHashtag(
        name!,
        filterDefinedKeys({
          limit: Config.fetchLimit,
          maxId: lastFetchedId,
        }),
      );
      return response.value;
    },
    [apiClient, name],
  );

  useEffect(() => {
    let stream: WsEvents;
    (async () => {
      stream = await apiClient.stream.streamTagTimeline(name!);
      setEventStream(stream);
    })();

    return () => stream?.disconnect();
  }, [apiClient, name]);

  return eventStream ? (
    <Timeline fetchData={fetchData} eventStream={eventStream} />
  ) : null;
};
