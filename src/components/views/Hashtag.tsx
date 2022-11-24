import React, { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Config } from "../../config";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Timeline } from "../layout/Timeline";

export const Hashtag = () => {
  const { setCurrentTimeline, apiClient } = useAppContext();
  const { name } = useParams();

  useEffect(() => {
    setCurrentTimeline(TimelineType.Hashtag);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      const response = await apiClient.getTagTimeline(name!, {
        limit: Config.fetchLimit,
        max_id: lastFetchedId,
      });
      return response.data;
    },
    [apiClient, name],
  );

  return <Timeline fetchData={fetchData} />;
};
