import { Space, Stack } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timeline } from "../components/Timeline";
import { Toot } from "../components/toot/Toot";
import { Config } from "../config";
import { TimelineType, useAppContext } from "../contexts/AppContext";
import { getApiClient } from "../utils/getApiClient";

export const TootThread = () => {
  const { id } = useParams();
  const [root, setRoot] = useState<Entity.Status>();
  // mastodon context returns ALL descendants, without limiting
  const [loaded, setLoaded] = useState(false);
  const { setCurrentTimeline } = useAppContext();

  useEffect(() => {
    setCurrentTimeline(TimelineType.None);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      if (id && !loaded) {
        const apiClient = await getApiClient();
        const response = await apiClient.getStatusContext(id, {
          limit: Config.fetchLimit,
          max_id: lastFetchedId,
        });
        setLoaded(true);
        return response.data.descendants;
      }

      return [];
    },
    [id, loaded],
  );

  const getRoot = useCallback(async () => {
    if (id) {
      const apiClient = await getApiClient();
      const response = await apiClient.getStatus(id);
      setRoot(response.data);
    }
  }, [id]);

  useEffect(() => {
    getRoot();
  }, [getRoot]);

  return (
    <Stack spacing={0}>
      {root && (
        <Timeline
          fetchData={fetchData}
          firstItem={<Toot toot={root} onUpdate={getRoot} />}
          lastItem={<Space h="xl" my="xl" />}
        />
      )}
    </Stack>
  );
};
