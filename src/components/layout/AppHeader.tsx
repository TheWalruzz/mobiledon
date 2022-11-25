import React, { ReactNode, useCallback, useMemo } from "react";
import { ActionIcon, Avatar, Button, Group, Header, Menu } from "@mantine/core";
import {
  IconBrandMastodon,
  IconHash,
  IconList,
  IconUsers,
  IconWorld,
} from "@tabler/icons";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TimelineType, useAppContext } from "../../contexts/AppContext";

export const AppHeader = () => {
  const { t } = useTranslation();
  const { setNavbarOpen, user, currentTimeline, scrollAreaRef } =
    useAppContext();
  const navigate = useNavigate();

  const timelineTypes: Record<
    Exclude<TimelineType, TimelineType.None | TimelineType.Hashtag>,
    { icon: ReactNode; label: string; path: string }
  > = useMemo(
    () => ({
      [TimelineType.Home]: {
        icon: <IconList />,
        label: t("nav.homeTimeline", "Home Timeline"),
        path: "/",
      },
      [TimelineType.Local]: {
        icon: <IconUsers />,
        label: t("nav.localTimeline", "Local Timeline"),
        path: "/local",
      },
      [TimelineType.Global]: {
        icon: <IconWorld />,
        label: t("nav.globalTimeline", "Global Timeline"),
        path: "/global",
      },
    }),
    [t],
  );

  const timeline = useMemo(
    () =>
      currentTimeline === TimelineType.None
        ? TimelineType.Home
        : currentTimeline,
    [currentTimeline],
  );

  const toggleNavbar = useCallback(
    () => setNavbarOpen((isOpen) => !isOpen),
    [setNavbarOpen],
  );

  const onHomeClick = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate("/");
  }, [navigate, scrollAreaRef]);

  return (
    <Header height={60} p="md">
      <Group position="apart" align="center">
        <ActionIcon onClick={toggleNavbar} title={t("nav.sidebar", "Sidebar")}>
          <Avatar src={user.avatar} alt={t("nav.avatar", "Your avatar")} />
        </ActionIcon>
        <Button
          leftIcon={<IconBrandMastodon />}
          compact
          variant="subtle"
          color="gray"
          fw={700}
          onClick={onHomeClick}
        >
          Mobiledon
        </Button>
        <Menu>
          <Menu.Target>
            <ActionIcon>
              {timeline === TimelineType.Hashtag ? (
                <IconHash />
              ) : (
                timelineTypes[timeline].icon
              )}
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            {Object.keys(timelineTypes).map((timeline) => (
              <Menu.Item
                key={timeline}
                icon={
                  timelineTypes[
                    timeline as Exclude<
                      TimelineType,
                      TimelineType.None | TimelineType.Hashtag
                    >
                  ].icon
                }
                component={Link}
                to={
                  timelineTypes[
                    timeline as Exclude<
                      TimelineType,
                      TimelineType.None | TimelineType.Hashtag
                    >
                  ].path
                }
              >
                {
                  timelineTypes[
                    timeline as Exclude<
                      TimelineType,
                      TimelineType.None | TimelineType.Hashtag
                    >
                  ].label
                }
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Header>
  );
};
