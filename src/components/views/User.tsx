import React, { useCallback, useEffect, useState } from "react";
import { Account, Relationship } from "masto";
import { useParams } from "react-router-dom";
import {
  ActionIcon,
  Avatar,
  BackgroundImage,
  Box,
  Button,
  Group,
  Indicator,
  LoadingOverlay,
  Menu,
  Paper,
  ScrollArea,
  Space,
  Stack,
  Table,
  Tabs,
  Text,
  TypographyStylesProvider,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { TimelineType, useAppContext } from "../../contexts/AppContext";
import { filterDefinedKeys } from "../../utils/filterObject";
import { Config } from "../../config";
import { Timeline } from "../layout/Timeline";
import { IconCircleCheck, IconDotsVertical } from "@tabler/icons";
import { InnerHTML } from "../utils/InnerHTML";
import { getDisplayName } from "../../utils/getDisplayName";
import { ParsedContent } from "../toot/ParsedContent";

export const User = () => {
  const { t } = useTranslation();
  const { apiClient, user: currentUser, setCurrentTimeline } = useAppContext();
  const [user, setUser] = useState<Account>();
  const [relationship, setRelationship] = useState<Relationship>();
  const [loading, setLoading] = useState(false);
  const { acct } = useParams();

  useEffect(() => {
    setCurrentTimeline(TimelineType.None);
  }, [setCurrentTimeline]);

  const fetchRelationship = useCallback(
    async (accountId: string) => {
      const relationships = await apiClient.accounts.fetchRelationships([
        accountId,
      ]);
      setRelationship(relationships[0]);
    },
    [apiClient.accounts],
  );

  const fetchUser = useCallback(async () => {
    if (acct) {
      setLoading(true);
      const account = await apiClient.accounts.lookup({ acct });
      setUser(account);
      fetchRelationship(account.id);
      setLoading(false);
    }
  }, [acct, apiClient.accounts, fetchRelationship]);

  const fetchToots = useCallback(
    async (lastFetchedId?: string) => {
      if (user) {
        const response = await apiClient.accounts.fetchStatuses(
          user.id,
          filterDefinedKeys({
            limit: Config.fetchLimit,
            maxId: lastFetchedId,
          }),
        );
        return response.value;
      }

      return [];
    },
    [apiClient, user],
  );

  const onFollowClick = useCallback(async () => {
    if (user) {
      if (relationship?.following) {
        await apiClient.accounts.unfollow(user?.id);
      } else {
        await apiClient.accounts.follow(user?.id);
      }
      fetchRelationship(user.id);
    }
  }, [apiClient.accounts, fetchRelationship, relationship?.following, user]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Stack h="100%">
      <Paper h="50%">
        <BackgroundImage
          h="30%"
          src={user?.header ?? ""}
          style={{ position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 0,
              transform: "translateY(50%)",
            }}
          >
            <Indicator
              size={16}
              position="bottom-center"
              disabled={!user?.bot}
              label="BOT"
              color="gray"
              withBorder
              inline
            >
              <Avatar size="xl" src={user?.avatar} alt={user?.username} />
            </Indicator>
          </div>
        </BackgroundImage>
        <Box
          style={{ position: "relative", height: "100%", width: "100%" }}
          p="xs"
        >
          <Group position="right">
            {user?.id !== currentUser.id && (
              <Button onClick={onFollowClick}>
                {relationship?.following
                  ? t("account.stopFollow", "Stop Following")
                  : t("account.follow", "Follow")}
              </Button>
            )}
            <Menu>
              <Menu.Target>
                <ActionIcon>
                  <IconDotsVertical />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>WIP</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          {user && (
            <TypographyStylesProvider>
              <Stack spacing={0} style={{ minWidth: 0 }} p="xs">
                <Text fw={600} lineClamp={1} fz="sm">
                  <InnerHTML>{getDisplayName(user)}</InnerHTML>
                </Text>
                <Text c="dimmed" opacity={0.8} lineClamp={1} fz="sm">
                  @{user.acct}
                </Text>
                {user.id !== currentUser.id && relationship?.followedBy && (
                  <Text size="sm" color="dimmed">
                    {t("account.followedBy", "This user is following you")}
                  </Text>
                )}
                <ParsedContent html={user.note ?? ""} context={user} mt="xs" />
              </Stack>
            </TypographyStylesProvider>
          )}
        </Box>
      </Paper>
      {!loading && (
        <Tabs
          defaultValue={user?.fields?.length ? "fields" : "toots"}
          style={{ height: "50%" }}
        >
          <Tabs.List>
            {/* TODO: add pinned toots */}
            {user?.fields?.length && (
              <Tabs.Tab value="fields">
                {t("account.fields", "Fields")}
              </Tabs.Tab>
            )}
            <Tabs.Tab value="toots">{t("account.toots", "Toots")}</Tabs.Tab>
            <Tabs.Tab value="followers">
              {t("account.followers", "Followers")}
            </Tabs.Tab>
            <Tabs.Tab value="following">
              {t("account.following", "Following")}
            </Tabs.Tab>
          </Tabs.List>

          {user?.fields?.length && (
            <Tabs.Panel value="fields" h="calc(100% - 36px)">
              <ScrollArea h="100%">
                <Table width="100%" withColumnBorders withBorder>
                  <tbody>
                    {user?.fields?.map((field) => (
                      <tr key={`userFields--${field.name}`}>
                        <td>
                          <Text fw="bold">{field.name}</Text>
                        </td>
                        <td>
                          <Group>
                            <TypographyStylesProvider>
                              <InnerHTML>{field.value}</InnerHTML>
                            </TypographyStylesProvider>
                            {field.verifiedAt && (
                              <IconCircleCheck color="green" />
                            )}
                          </Group>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Tabs.Panel>
          )}

          <Tabs.Panel value="toots" h="calc(100% - 36px)">
            {user && (
              <Timeline
                fetchData={fetchToots}
                lastItem={<Space h="xl" my="xl" />}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="followers">
            <div />
          </Tabs.Panel>

          <Tabs.Panel value="following">
            <div />
          </Tabs.Panel>
        </Tabs>
      )}
      <LoadingOverlay visible={loading} />
    </Stack>
  );
};
