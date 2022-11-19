import React, { useCallback, useEffect } from "react";
import { getApiClient } from "../utils/getApiClient";
import { Timeline } from "../components/Timeline";
import { TimelineType, useAppContext } from "../contexts/AppContext";
import { Config } from "../config";

export const HomeTimeline = () => {
  const { setCurrentTimeline } = useAppContext();
  useEffect(() => {
    setCurrentTimeline(TimelineType.Home);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(async (lastFetchedId?: string) => {
    const apiClient = await getApiClient();
    const response = await apiClient.getHomeTimeline({
      limit: Config.fetchLimit,
      max_id: lastFetchedId,
    });
    return response.data;
  }, []);

  return <Timeline fetchData={fetchData} />;
};
