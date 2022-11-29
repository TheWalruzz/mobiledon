import React, { useCallback, useEffect } from "react";
import { StatusTimeline } from "../layout/StatusTimeline";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";
import { filterDefinedKeys } from "../../utils/filterObject";

export const HomeTimeline = () => {
  const { setCurrentTimeline, apiClient, streams } = useAppContext();
  useEffect(() => {
    setCurrentTimeline(TimelineType.Home);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      const response = await apiClient.timelines.fetchHome(
        filterDefinedKeys({
          limit: Config.fetchLimit,
          maxId: lastFetchedId,
        }),
      );
      return response.value;
    },
    [apiClient],
  );

  return <StatusTimeline fetchData={fetchData} eventStream={streams.user} />;
};
