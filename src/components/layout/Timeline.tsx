import React, { FC, ReactNode, useCallback, useEffect, useState } from "react";
import {
  LoadingOverlay,
  ScrollArea,
  Stack,
  Center,
  Text,
  Affix,
  ActionIcon,
  Group,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import PullToRefresh from "react-simple-pull-to-refresh";
import RenderIfVisible from "react-render-if-visible";
import { IconArrowBigDownLines, IconPencil } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { Status, WsEvents } from "masto";
import { Toot } from "../toot/Toot";
import { useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";
import { EditTootModalProps } from "../modals/EditTootModal";
import { useCustomModal } from "../../contexts/CustomModalContext";
import { useWebSocketEvent } from "../../hooks/useWebSocketEvent";

interface TimelineProps {
  fetchData: (lastFetchedId?: string) => Promise<Status[]>;
  firstItem?: ReactNode;
  lastItem?: ReactNode;
  eventStream?: WsEvents;
}

export const Timeline: FC<TimelineProps> = ({
  fetchData,
  firstItem,
  lastItem,
  eventStream,
}) => {
  const { t } = useTranslation();
  const { openCustomModal } = useCustomModal();
  const { scrollAreaRef, apiClient } = useAppContext();
  // TODO: save loaded toots in global state for back functionality
  const [toots, setToots] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref: sentryRef, entry } = useIntersection({
    root: scrollAreaRef.current,
    threshold: 0,
    rootMargin: "0px 0px 2000px 0px",
  });

  const onLoadMore = useCallback(async () => {
    setLoading(true);
    const results = await fetchData(
      toots.length > 0 ? toots[toots.length - 1].id : undefined,
    );
    if (results.length < Config.fetchLimit) {
      setHasMore(false);
    }
    setToots((oldToots) => [...oldToots, ...results]);
    setLoading(false);
  }, [fetchData, toots]);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    const results = await fetchData();
    setToots(results);
    setLoading(false);
  }, [fetchData]);

  const onTootUpdate = useCallback(
    async (id: string) => {
      const updatedStatus = await apiClient.statuses.fetch(id);
      const newToots = [...toots];
      const index = toots.findIndex((value) => value.id === id);
      if (index !== -1) {
        newToots[index] = updatedStatus;
        setToots(newToots);
      }
    },
    [apiClient, toots],
  );

  const onSubmit = useCallback(
    async (text: string, options: Record<string, any> = {}) => {
      await apiClient.statuses.create({ status: text, ...options });
      onRefresh();
    },
    [apiClient, onRefresh],
  );

  const openEditTootModal = useCallback(() => {
    openCustomModal<EditTootModalProps>("editToot", {
      title: t("toot.newToot", "New Toot"),
      onSubmit,
    });
  }, [onSubmit, openCustomModal, t]);

  const onStreamUpdate = useCallback((toot: Status) => {
    setToots((oldToots) => [toot, ...oldToots]);
  }, []);

  useWebSocketEvent(eventStream, "update", onStreamUpdate);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore) {
      onLoadMore();
    }
  }, [entry?.isIntersecting, hasMore, onLoadMore]);

  return (
    <>
      <ScrollArea
        type="scroll"
        style={{ height: "calc(100vh - 120px)", maxWidth: "100vw" }}
        p={0}
        scrollHideDelay={500}
        scrollbarSize={8}
        viewportRef={scrollAreaRef}
      >
        <LoadingOverlay visible={loading && toots.length === 0} />
        <PullToRefresh
          onRefresh={onRefresh}
          pullingContent={
            <Center p="xs">
              <Group>
                <IconArrowBigDownLines size={24} />
                <Text>
                  {t("timeline.pullToRefresh", "Pull down to refresh")}
                </Text>
                <IconArrowBigDownLines size={24} />
              </Group>
            </Center>
          }
        >
          <Stack spacing={0}>
            {firstItem}
            {toots.map((toot) => (
              <RenderIfVisible
                stayRendered
                key={toot.id}
                root={scrollAreaRef?.current}
              >
                <Toot toot={toot} onUpdate={onTootUpdate} />
              </RenderIfVisible>
            ))}
            {lastItem}
            {!loading && hasMore && (
              <Center p="xs" ref={sentryRef}>
                {toots.length > 0 && <Text>Loading...</Text>}
              </Center>
            )}
          </Stack>
        </PullToRefresh>
      </ScrollArea>
      <Affix
        position={{ bottom: 70, right: 15 }}
        target={scrollAreaRef.current!}
      >
        <ActionIcon
          variant="filled"
          color="blue"
          size={64}
          radius={64}
          onClick={openEditTootModal}
          sx={(theme) => ({ boxShadow: theme.shadows.sm })}
        >
          <IconPencil size={36} />
        </ActionIcon>
      </Affix>
    </>
  );
};
