import React, { useCallback, useEffect } from "react";
import { TootTimeline } from "../toot/TootTimeline";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";
import { filterDefinedKeys } from "../../utils/filterObject";

export const LocalTimeline = () => {
  const { setCurrentTimeline, apiClient, streams } = useAppContext();

  useEffect(() => {
    setCurrentTimeline(TimelineType.Local);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      const response = await apiClient.timelines.fetchPublic(
        filterDefinedKeys({
          local: true,
          limit: Config.fetchLimit,
          maxId: lastFetchedId,
        }),
      );
      return response.value;
    },
    [apiClient],
  );

  return <TootTimeline fetchData={fetchData} eventStream={streams.local} />;
};
