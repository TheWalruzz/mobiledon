import { Space, Stack } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timeline } from "../layout/Timeline";
import { Toot } from "../toot/Toot";
import { Config } from "../../config";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { getApiClient } from "../../utils/getApiClient";

export const TootThread = () => {
  const { id } = useParams();
  const [root, setRoot] = useState<Entity.Status>();

  const { setCurrentTimeline } = useAppContext();

  useEffect(() => {
    setCurrentTimeline(TimelineType.None);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      if (id && !lastFetchedId) {
        const apiClient = await getApiClient();
        const response = await apiClient.getStatusContext(id, {
          limit: Config.fetchLimit,
        });
        return response.data.descendants;
      }

      return [];
    },
    [id],
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
