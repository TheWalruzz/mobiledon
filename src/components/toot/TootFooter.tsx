import React, { FC, useCallback, useMemo } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  useMantineTheme,
} from "@mantine/core";
import {
  IconBookmark,
  IconDots,
  IconExchange,
  IconMessageDots,
  IconShare,
  IconStar,
} from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { EditTootModalProps } from "../modals/EditTootModal";
import { useCustomModal } from "../../contexts/CustomModalContext";
import { useAppContext } from "../../contexts/AppContext";

interface TootFooterProps {
  toot: Entity.Status;
  onUpdate: () => void;
}

const actionIconSize = 20;

export const TootFooter: FC<TootFooterProps> = ({ toot, onUpdate }) => {
  const { t } = useTranslation();
  const { apiClient } = useAppContext();
  const { openCustomModal } = useCustomModal();
  const theme = useMantineTheme();
  const currentToot = useMemo(() => toot.reblog ?? toot, [toot]);

  const share = useCallback(
    () =>
      navigator.share({
        url: currentToot.url,
      }),
    [currentToot],
  );

  // TODO: refresh data after doing actions
  const boost = useCallback(async () => {
    if (currentToot.reblogged) {
      await apiClient.unreblogStatus(currentToot.id);
    } else {
      await apiClient.reblogStatus(currentToot.id);
    }
    onUpdate();
  }, [currentToot.reblogged, currentToot.id, onUpdate, apiClient]);

  const favorite = useCallback(async () => {
    if (currentToot.favourited) {
      await apiClient.unfavouriteStatus(currentToot.id);
    } else {
      await apiClient.favouriteStatus(currentToot.id);
    }
    onUpdate();
  }, [apiClient, currentToot.favourited, currentToot.id, onUpdate]);

  const bookmark = useCallback(async () => {
    if (currentToot.bookmarked) {
      await apiClient.unbookmarkStatus(currentToot.id);
    } else {
      await apiClient.bookmarkStatus(currentToot.id);
    }
    onUpdate();
  }, [apiClient, currentToot.bookmarked, currentToot.id, onUpdate]);

  const onSubmit = useCallback(
    async (text: string, options?: Record<string, any>) => {
      await apiClient.postStatus(text, {
        in_reply_to_id: currentToot.id,
        ...options,
      });
    },
    [apiClient, currentToot.id],
  );

  const reply = useCallback(() => {
    openCustomModal<EditTootModalProps>("editToot", {
      title: t("toot.reply", "Reply"),
      toot: currentToot,
      initialValue: `@${currentToot.account.acct}&nbsp;`,
      initialVisibility: "unlisted",
      onSubmit,
    });
  }, [currentToot, onSubmit, openCustomModal, t]);

  return (
    <>
      <Group position="apart" mt="xs">
        <Button
          p={2}
          compact
          leftIcon={<IconMessageDots size={actionIconSize} />}
          title={t("toot.reply", "Reply")}
          c="dimmed"
          variant="subtle"
          onClick={reply}
        >
          {currentToot.replies_count > 1 ? "1+" : currentToot.replies_count}
        </Button>

        <Button
          p={2}
          compact
          leftIcon={<IconExchange size={actionIconSize} />}
          title={t("toot.boost", "Boost")}
          c={currentToot.reblogged ? theme.colors.blue[7] : "dimmed"}
          variant="subtle"
          onClick={boost}
        >
          {currentToot.reblogs_count > 999 ? "1K+" : currentToot.reblogs_count}
        </Button>

        <Button
          p={2}
          compact
          leftIcon={<IconStar size={actionIconSize} />}
          title={t("toot.favorite", "Add to favorites")}
          c={currentToot.favourited ? theme.colors.yellow[7] : "dimmed"}
          variant="subtle"
          onClick={favorite}
        >
          {currentToot.favourites_count > 999
            ? "1K+"
            : currentToot.favourites_count}
        </Button>

        <ActionIcon
          p={2}
          title={t("toot.bookmark", "Add to bookmarks")}
          c={currentToot.bookmarked ? theme.colors.green[7] : "dimmed"}
          variant="subtle"
          onClick={bookmark}
        >
          <IconBookmark size={actionIconSize} />
        </ActionIcon>

        <ActionIcon
          p={2}
          title={t("toot.share", "Share")}
          c="dimmed"
          color="gray"
          variant="subtle"
          onClick={share}
        >
          <IconShare size={actionIconSize} />
        </ActionIcon>

        <Menu>
          <Menu.Target>
            <ActionIcon
              p={2}
              title={t("toot.more", "More")}
              c="dimmed"
              color="gray"
              variant="subtle"
            >
              <IconDots size={actionIconSize} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item>WIP</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
};
