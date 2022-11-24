import React, { useCallback, useEffect, useState } from "react";
import { ActionIcon, Footer, Group, Indicator } from "@mantine/core";
import { IconBell, IconHome, IconMail, IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";
import { useWebSocketEvent } from "../../hooks/useWebSocketEvent";

export const AppFooter = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentTimeline, scrollAreaRef, apiClient, streams } =
    useAppContext();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    const notifications = await apiClient.notifications.fetchMany({
      limit: Config.fetchLimit,
    });

    setNotificationCount(notifications.value.length);
  }, [apiClient.notifications]);

  useWebSocketEvent(streams.user, "notification", fetchNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const navigateToHome = useCallback(() => {
    if (currentTimeline === TimelineType.Home && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  }, [currentTimeline, navigate, scrollAreaRef]);

  return (
    <Footer height={60} p="xs">
      <Group position="apart" align="center" px="sm" h="100%">
        <ActionIcon onClick={navigateToHome}>
          <IconHome />
        </ActionIcon>
        <ActionIcon>
          <IconSearch />
        </ActionIcon>
        <Indicator
          size={19}
          disabled={notificationCount === 0}
          label={notificationCount}
          overflowCount={9}
          offset={5}
          withBorder
          inline
          styles={{ indicator: { padding: 0 } }}
        >
          <ActionIcon>
            <IconBell />
          </ActionIcon>
        </Indicator>
        <ActionIcon>
          <IconMail />
        </ActionIcon>
      </Group>
    </Footer>
  );
};
