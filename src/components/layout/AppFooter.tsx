import React, { useCallback, useEffect, useState } from "react";
import { ActionIcon, Footer, Group, Indicator } from "@mantine/core";
import { IconBell, IconHome, IconMail, IconSearch } from "@tabler/icons";
import { getApiClient } from "../../utils/getApiClient";
import { useNavigate } from "react-router-dom";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { Config } from "../../config";

export const AppFooter = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentTimeline, scrollAreaRef } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const apiClient = await getApiClient();
      const notifications = await apiClient.getNotifications({
        limit: Config.fetchLimit,
      });

      setNotificationCount(notifications.data.length);
    })();
  }, []);

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
