import React, { FC, useCallback, useMemo } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import {
  IconBookmark,
  IconDots,
  IconExchange,
  IconMessageDots,
  IconPencil,
  IconShare,
  IconStar,
  IconTrash,
} from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { Status } from "masto";
import { EditTootModalProps } from "../modals/EditTootModal";
import { useCustomModal } from "../../contexts/CustomModalContext";
import { useAppContext } from "../../contexts/AppContext";
import { showNotification } from "@mantine/notifications";

interface TootFooterProps {
  toot: Status;
  onUpdate: () => void;
  onRemove: () => void;
}

const actionIconSize = 20;

export const TootFooter: FC<TootFooterProps> = ({
  toot,
  onUpdate,
  onRemove,
}) => {
  const { t } = useTranslation();
  const { apiClient, user } = useAppContext();
  const { openCustomModal } = useCustomModal();
  const theme = useMantineTheme();
  const currentToot = useMemo(() => toot.reblog ?? toot, [toot]);

  const isOwner = useMemo(
    () => currentToot.account.id === user.id,
    [currentToot.account.id, user.id],
  );

  const share = useCallback(
    () =>
      navigator.share({
        url: currentToot.url!,
      }),
    [currentToot],
  );

  // TODO: refresh data after doing actions
  const boost = useCallback(async () => {
    if (currentToot.reblogged) {
      await apiClient.statuses.unreblog(currentToot.id);
    } else {
      await apiClient.statuses.reblog(currentToot.id);
    }
    onUpdate();
  }, [currentToot.reblogged, currentToot.id, onUpdate, apiClient]);

  const favorite = useCallback(async () => {
    if (currentToot.favourited) {
      await apiClient.statuses.unfavourite(currentToot.id);
    } else {
      await apiClient.statuses.favourite(currentToot.id);
    }
    onUpdate();
  }, [apiClient, currentToot.favourited, currentToot.id, onUpdate]);

  const bookmark = useCallback(async () => {
    if (currentToot.bookmarked) {
      await apiClient.statuses.unbookmark(currentToot.id);
    } else {
      await apiClient.statuses.bookmark(currentToot.id);
    }
    onUpdate();
  }, [apiClient, currentToot.bookmarked, currentToot.id, onUpdate]);

  const deleteToot = useCallback(() => {
    openConfirmModal({
      title: <Text fw={700}>{t("common.confirmTitle", "Are you sure?")}</Text>,
      centered: true,
      children: (
        <Text size="sm">
          {t(
            "toot.deleteConfirm",
            "If you continue, your toot will be lost forever.",
          )}
        </Text>
      ),
      labels: {
        confirm: t("common.yes", "Yes"),
        cancel: t("common.no", "No"),
      },
      onConfirm: async () => {
        await apiClient.statuses.remove(toot.id);
        onRemove();
        showNotification({
          message: t("toot.deletedMessage", "Toot was deleted."),
          autoClose: 3000,
          color: "red",
        });
      },
      zIndex: 800,
    });
  }, [apiClient.statuses, onRemove, t, toot.id]);

  const onSubmit = useCallback(
    async (text: string, options?: Record<string, any>) => {
      await apiClient.statuses.create({
        status: text,
        inReplyToId: currentToot.id,
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

  const editToot = useCallback(() => {
    openCustomModal<EditTootModalProps>("editToot", {
      title: t("toot.edit", "Edit"),
      initialValue: currentToot.content,
      initialVisibility: currentToot.visibility,
      onSubmit: async (text, options) => {
        await apiClient.statuses.update(currentToot.id, {
          status: text,
          ...options,
        });
        onUpdate();
      },
    });
  }, [
    apiClient.statuses,
    currentToot.content,
    currentToot.id,
    currentToot.visibility,
    onUpdate,
    openCustomModal,
    t,
  ]);

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
          {currentToot.repliesCount > 1 ? "1+" : currentToot.repliesCount}
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
          {currentToot.reblogsCount > 999 ? "1K+" : currentToot.reblogsCount}
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
          {currentToot.favouritesCount > 999
            ? "1K+"
            : currentToot.favouritesCount}
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
            {isOwner && (
              <Menu.Item icon={<IconPencil />} onClick={editToot}>
                {t("toot.edit", "Edit")}
              </Menu.Item>
            )}
            {isOwner && (
              <Menu.Item icon={<IconTrash />} onClick={deleteToot} color="red">
                {t("toot.delete", "Delete")}
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>
    </>
  );
};
