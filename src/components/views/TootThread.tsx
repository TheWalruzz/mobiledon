import { Space, Stack } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Timeline } from "../layout/Timeline";
import { Toot } from "../toot/Toot";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Status } from "masto";

export const TootThread = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [root, setRoot] = useState<Status>();

  const { setCurrentTimeline, apiClient } = useAppContext();

  useEffect(() => {
    setCurrentTimeline(TimelineType.None);
  }, [setCurrentTimeline]);

  const fetchData = useCallback(
    async (lastFetchedId?: string) => {
      if (id && !lastFetchedId) {
        const response = await apiClient.statuses.fetchContext(id);
        return response.descendants;
      }

      return [];
    },
    [apiClient, id],
  );

  const getRoot = useCallback(async () => {
    if (id) {
      const response = await apiClient.statuses.fetch(id);
      setRoot(response);
    }
  }, [apiClient, id]);

  const onTootRemove = useCallback(
    (id: string) => {
      navigate("/");
    },
    [navigate],
  );

  useEffect(() => {
    getRoot();
  }, [getRoot]);

  return (
    <Stack spacing={0}>
      {root && (
        <Timeline
          fetchData={fetchData}
          firstItem={
            <Toot toot={root} onUpdate={getRoot} onRemove={onTootRemove} />
          }
          lastItem={<Space h="xl" my="xl" />}
        />
      )}
    </Stack>
  );
};
