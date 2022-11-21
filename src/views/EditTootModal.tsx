import React, { FC, useCallback, useEffect, useState } from "react";
import { openConfirmModal } from "@mantine/modals";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  Paper,
  Spoiler,
  Text,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useTranslation } from "react-i18next";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { IconPaperclip } from "@tabler/icons";
import { TootHeader } from "../components/toot/TootHeader";
import { TootContent } from "../components/toot/TootContent";
import { Visibility, VisibilityIcon } from "../components/VisibilityIcon";
import { suggestion } from "../components/editor/Suggestion";
import { MediaUploadGrid } from "../components/MediaUploadGrid";
import { useFileUpload } from "../hooks/useFileUpload";
import { ImageDetailsModal } from "./ImageDetailsModal";
import { getApiClient } from "../utils/getApiClient";

interface EditTootModalProps extends Record<string, unknown> {
  toot?: Entity.Status;
  initialValue?: string;
  initialVisibility?: Visibility;
  onSubmit: (text: string, options?: Record<string, any>) => void;
  onClose: () => void;
  opened: boolean;
  title: string;
}

const iconSize = 18;

export const EditTootModal: FC<EditTootModalProps> = ({
  toot,
  initialValue = "",
  initialVisibility = "public",
  onSubmit,
  onClose,
  opened,
  title,
}) => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);
  const { fileInputRef, files, onFileInputChange, removeFile, updateFile } =
    useFileUpload();
  const [imageDetailsOpened, setImageDetailsOpened] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: suggestion("@", "accounts", (item) => item.acct),
      }),
      Mention.extend({ name: "hashtag" }).configure({
        HTMLAttributes: {
          class: "hashtag",
        },
        suggestion: suggestion("#", "hashtags", (item) => item.name),
      }),
    ],
    content: initialValue || "",
  });

  const handleClose = useCallback(() => {
    if (editor?.getText()) {
      openConfirmModal({
        title: (
          <Text fw={700}>{t("common.confirmTitle", "Are you sure?")}</Text>
        ),
        centered: true,
        children: (
          <Text size="sm">
            {t(
              "editToot.confirmText",
              "If you continue, your toot will be lost forever.",
            )}
          </Text>
        ),
        labels: {
          confirm: t("common.yes", "Yes"),
          cancel: t("common.no", "No"),
        },
        onConfirm: () => {
          onClose();
        },
        zIndex: 800,
      });
      return;
    }

    onClose();
  }, [editor, onClose, t]);

  const handleSubmit = useCallback(async () => {
    const apiClient = await getApiClient();
    let mediaIds: string[] = [];
    if (files.length > 0) {
      mediaIds = (
        await Promise.all(
          files.map(({ file, description, focus }) =>
            apiClient.uploadMedia(file, {
              description,
              focus: focus ? `${focus.x},${focus.y}` : undefined,
            }),
          ),
        )
      ).map((result) => result.data.id);
    }

    onSubmit(editor?.getText() ?? "", {
      visibility,
      media_ids: mediaIds.length > 0 ? [] : undefined,
      // TODO: add polls and other stuff
    });
    onClose();
  }, [files, onSubmit, editor, visibility, onClose]);

  const handleImageDetails = useCallback((index: number) => {
    setCurrentFileIndex(index);
    setImageDetailsOpened(true);
  }, []);

  useEffect(() => {
    editor?.commands.focus();
  }, [editor]);

  return (
    <Modal
      closeOnEscape={false}
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>{title}</Text>}
    >
      {toot && (
        <Paper p="xs" mb="sm" withBorder>
          <TootHeader toot={toot} hideDate hideReblog />
          <Spoiler
            maxHeight={50}
            hideLabel={t("common.hide", "Hide")}
            showLabel={t("common.show", "Show")}
          >
            <TootContent toot={toot.reblog || toot} onContentClick={() => {}} />
          </Spoiler>
        </Paper>
      )}
      <RichTextEditor editor={editor} mb="xs" h={300}>
        {/* <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup></RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar> */}
        <RichTextEditor.Content />
      </RichTextEditor>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/x-m4v,video/quicktime,video/webm,audio/mpeg3,audio/ogg,audio/x-wav,audio/flac,audio/opus,audio/aac,audio/mp4"
        onChange={onFileInputChange}
      />
      <Group mb="xs">
        <ActionIcon
          variant="filled"
          onClick={() => fileInputRef.current?.click()}
        >
          <IconPaperclip size={iconSize} />
        </ActionIcon>

        <Menu>
          <Menu.Target>
            <ActionIcon variant="filled">
              <VisibilityIcon visibility={visibility} size={iconSize} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<VisibilityIcon visibility="public" size={iconSize} />}
              onClick={() => setVisibility("public")}
            >
              {t("visibility.public", "Public")}
            </Menu.Item>
            <Menu.Item
              icon={<VisibilityIcon visibility="unlisted" size={iconSize} />}
              onClick={() => setVisibility("unlisted")}
            >
              {t("visibility.unlisted", "Unlisted")}
            </Menu.Item>
            <Menu.Item
              icon={<VisibilityIcon visibility="private" size={iconSize} />}
              onClick={() => setVisibility("private")}
            >
              {t("visibility.private", "Private")}
            </Menu.Item>
            <Menu.Item
              icon={<VisibilityIcon visibility="direct" size={iconSize} />}
              onClick={() => setVisibility("direct")}
            >
              {t("visibility.direct", "Direct")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <MediaUploadGrid
        files={files}
        onRemove={removeFile}
        onClick={handleImageDetails}
      />
      <Flex justify="end">
        <Group>
          <Button variant="default" onClick={handleClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {t("editToot.submitLabel", "Toot!")}
          </Button>
        </Group>
      </Flex>
      <ImageDetailsModal
        fileDetails={files.length > 0 ? files[currentFileIndex] : null}
        opened={imageDetailsOpened}
        onClose={() => setImageDetailsOpened(false)}
        onSubmit={(details) => updateFile(currentFileIndex, details)}
      />
    </Modal>
  );
};
