import { Space, Stack } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timeline } from "../layout/Timeline";
import { Toot } from "../toot/Toot";
import { Config } from "../../config";
import { TimelineType, useAppContext } from "../../contexts/AppContext";

export const TootThread = () => {
  const { id } = useParams();
  const [root, setRoot] = useState<Entity.Status>();

  const { setCurrentTimeline, apiClient } = useAppContext();

  useEffect(() => {
    setCurrentTimeline(TimelineType.None);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      if (id && !lastFetchedId) {
        const response = await apiClient.getStatusContext(id, {
          limit: Config.fetchLimit,
        });
        return response.data.descendants;
      }

      return [];
    },
    [apiClient, id],
  );

  const getRoot = useCallback(async () => {
    if (id) {
      const response = await apiClient.getStatus(id);
      setRoot(response.data);
    }
  }, [apiClient, id]);

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
