import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Center,
  Group,
  LoadingOverlay,
  ScrollArea,
  Space,
  Stack,
  Text,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IconArrowBigDownLines } from "@tabler/icons";
import RenderIfVisible from "react-render-if-visible";
import { useTranslation } from "react-i18next";
import { useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";

interface AsyncListProps<ItemType extends object = any> {
  fetchData: (lastFetchedId?: string) => Promise<ItemType[]>;
  children: (
    item: ItemType,
    onUpdate: (id: string, updatedItem: ItemType) => void,
    onRemove: (id: string) => void,
  ) => ReactNode;
  getId: (item: ItemType) => string;
  firstItem?: ReactNode;
  useStreamHandler?: (handler: (toot: ItemType) => void) => void;
  refreshRef?: MutableRefObject<(() => Promise<void>) | undefined>;
}

export function AsyncList<ItemType extends object = any>({
  fetchData,
  getId,
  children,
  useStreamHandler = () => {},
  firstItem,
  refreshRef,
}: AsyncListProps<ItemType>) {
  const { t } = useTranslation();
  const { scrollAreaRef } = useAppContext();
  const [items, setItems] = useState<ItemType[]>([]);
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
      items.length > 0 ? getId(items[items.length - 1]) : undefined,
    );
    if (results.length < Config.fetchLimit) {
      setHasMore(false);
    }
    setItems((oldToots) => [...oldToots, ...results]);
    setLoading(false);
  }, [fetchData, getId, items]);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    const results = await fetchData();
    setItems(results);
    setLoading(false);
  }, [fetchData]);

  const onUpdate = useCallback(
    async (id: string, updatedItem: ItemType) => {
      const newItems = [...items];
      const index = items.findIndex((value) => getId(value) === id);
      if (index !== -1) {
        newItems[index] = updatedItem;
        setItems(newItems);
      }
    },
    [getId, items],
  );

  const onRemove = useCallback(
    (id: string) => {
      const newItems = [...items].filter((item) => getId(item) !== id);
      setItems(newItems);
    },
    [getId, items],
  );

  const onStreamUpdate = useCallback((item: ItemType) => {
    setItems((oldItems) => [item, ...oldItems]);
  }, []);

  useStreamHandler(onStreamUpdate);

  useEffect(() => {
    if (entry?.isIntersecting && hasMore) {
      onLoadMore();
    }
  }, [entry?.isIntersecting, hasMore, onLoadMore, onRefresh, refreshRef]);

  useEffect(() => {
    if (refreshRef) {
      refreshRef.current = onRefresh;
    }
  }, [onRefresh, refreshRef]);

  return (
    <ScrollArea
      type="scroll"
      style={{ height: "100%", maxWidth: "100vw" }}
      p={0}
      scrollHideDelay={500}
      scrollbarSize={8}
      viewportRef={scrollAreaRef}
    >
      <LoadingOverlay visible={loading && items.length === 0 && !firstItem} />
      <PullToRefresh
        onRefresh={onRefresh}
        pullingContent={
          <Center p="xs">
            <Group>
              <IconArrowBigDownLines size={24} />
              <Text>{t("timeline.pullToRefresh", "Pull down to refresh")}</Text>
              <IconArrowBigDownLines size={24} />
            </Group>
          </Center>
        }
      >
        <Stack spacing={0}>
          {firstItem}
          {items.map((item) => (
            <RenderIfVisible
              stayRendered
              key={getId(item)}
              root={scrollAreaRef?.current}
            >
              {children(item, onUpdate, onRemove)}
            </RenderIfVisible>
          ))}
          <Space h="xl" my="xl" />
          {!loading && hasMore && (
            <Center p="xs" ref={sentryRef}>
              {items.length > 0 && (
                <Text>{t("common.loading", "Loading...")}</Text>
              )}
            </Center>
          )}
        </Stack>
      </PullToRefresh>
    </ScrollArea>
  );
}
