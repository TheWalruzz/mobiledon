import React, { useCallback, useEffect } from "react";
import { getApiClient } from "../../utils/getApiClient";
import { Timeline } from "../layout/Timeline";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";

export const GlobalTimeline = () => {
  const { setCurrentTimeline } = useAppContext();

  useEffect(() => {
    setCurrentTimeline(TimelineType.Global);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(async (lastFetchedId?: string) => {
    const apiClient = await getApiClient();
    const response = await apiClient.getPublicTimeline({
      limit: Config.fetchLimit,
      max_id: lastFetchedId,
    });
    return response.data;
  }, []);

  return <Timeline fetchData={fetchData} />;
};
