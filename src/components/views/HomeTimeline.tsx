import React, { useCallback, useEffect } from "react";
import { Timeline } from "../layout/Timeline";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";

export const HomeTimeline = () => {
  const { setCurrentTimeline, apiClient } = useAppContext();
  useEffect(() => {
    setCurrentTimeline(TimelineType.Home);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      const response = await apiClient.getHomeTimeline({
        limit: Config.fetchLimit,
        max_id: lastFetchedId,
      });
      return response.data;
    },
    [apiClient],
  );

  return <Timeline fetchData={fetchData} />;
};
