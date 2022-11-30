import React, { FC, useCallback, useEffect, useState } from "react";
import { openConfirmModal } from "@mantine/modals";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  Paper,
  Spoiler,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useTranslation } from "react-i18next";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { IconAlertTriangle, IconList, IconPaperclip } from "@tabler/icons";
import { Attachment, Status } from "masto";
import { TootHeader } from "../toot/TootHeader";
import { TootContent } from "../toot/TootContent";
import { Visibility, VisibilityIcon } from "../utils/VisibilityIcon";
import { suggestion } from "../editor/Suggestion";
import { MediaUploadGrid } from "./EditTootModal/MediaUploadGrid";
import { useFileUpload } from "../../hooks/useFileUpload";
import { ImageDetailsModalProps } from "./ImageDetailsModal";
import { useInputState, useListState } from "@mantine/hooks";
import { LanguageMenu } from "./EditTootModal/LanguageMenu";
import { PollInput } from "../toot/PollInput";
import {
  CustomModalProps,
  useCustomModal,
} from "../../contexts/CustomModalContext";

export interface EditTootModalProps extends Record<string, unknown> {
  toot?: Status;
  initialValue?: string;
  initialVisibility?: Visibility;
  initialFiles?: Attachment[];
  onSubmit: (text: string, options?: Record<string, any>) => void;
  onClose: () => void;
  title: string;
}

const iconSize = 18;

export const EditTootModal: FC<CustomModalProps<EditTootModalProps>> = ({
  innerProps: {
    toot,
    initialValue = "",
    initialVisibility = "public",
    initialFiles,
    onSubmit,
    title,
  },
  onClose,
  opened,
}) => {
  const { t, i18n } = useTranslation();
  const { openCustomModal } = useCustomModal();
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);
  const {
    fileInputRef,
    files,
    onFileInputChange,
    removeFile,
    updateFile,
    processing,
  } = useFileUpload(initialFiles);
  const [spoilerText, setSpoilerText] = useInputState<string | undefined>(
    undefined,
  );
  const [language, setLanguage] = useState(i18n.language);
  const [sensitive, setSensitive] = useState(false);
  const [hasPoll, setHasPoll] = useState(false);
  const [pollOptions, pollHandlers] = useListState<string>(["", ""]);
  const [pollMultiple, setPollMultiple] = useState(false);
  const [pollExpiresIn, setPollExpiresIn] = useState(300);
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
    const mediaIds = files.map((result) => result.id);

    onSubmit(editor?.getText() ?? "", {
      visibility,
      media_ids: mediaIds.length > 0 ? mediaIds : undefined,
      spoiler_text: spoilerText,
      language,
      sensitive: mediaIds.length > 0 ? sensitive : false,
      poll: hasPoll
        ? {
            options: pollOptions,
            expires_in: pollExpiresIn,
            multiple: pollMultiple,
          }
        : undefined,
    });
    onClose();
  }, [
    files,
    onSubmit,
    editor,
    visibility,
    spoilerText,
    language,
    sensitive,
    hasPoll,
    pollOptions,
    pollExpiresIn,
    pollMultiple,
    onClose,
  ]);

  const handleImageDetails = useCallback(
    (index: number) => {
      openCustomModal<ImageDetailsModalProps>("imageDetails", {
        fileDetails: files[index],
        onSubmit: (details) => updateFile(index, details),
      });
    },
    [files, openCustomModal, updateFile],
  );

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
      <LoadingOverlay visible={processing} />
      {toot && (
        <Paper p="xs" mb="sm" withBorder>
          <TootHeader toot={toot} hideDate hideReblog />
          <Spoiler
            maxHeight={50}
            hideLabel={t("common.hide", "Hide")}
            showLabel={t("common.show", "Show")}
          >
            <TootContent
              toot={toot.reblog || toot}
              onContentClick={() => {}}
              onUpdate={() => {}}
              readOnly
            />
          </Spoiler>
        </Paper>
      )}
      {spoilerText !== undefined && (
        <TextInput
          label={t(
            "editToot.contentWarningLabel",
            "Content warning description",
          )}
          value={spoilerText}
          onChange={setSpoilerText}
          mb="xs"
        />
      )}
      <RichTextEditor editor={editor} mb="xs" h={200}>
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
        {!hasPoll && (
          <ActionIcon
            variant="filled"
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPaperclip size={iconSize} />
          </ActionIcon>
        )}

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

        <ActionIcon
          variant="filled"
          color={spoilerText !== undefined ? "primary" : undefined}
          onClick={() =>
            setSpoilerText(spoilerText !== undefined ? undefined : "")
          }
        >
          <IconAlertTriangle size={iconSize} />
        </ActionIcon>

        <LanguageMenu onChange={setLanguage}>
          <ActionIcon variant="filled">
            {language.toLocaleUpperCase()}
          </ActionIcon>
        </LanguageMenu>

        {files.length === 0 && (
          <ActionIcon
            variant="filled"
            color={hasPoll ? "primary" : undefined}
            onClick={() => setHasPoll((value) => !value)}
          >
            <IconList size={iconSize} />
          </ActionIcon>
        )}
      </Group>
      <MediaUploadGrid
        files={files}
        onRemove={removeFile}
        onClick={handleImageDetails}
        canEdit={!initialFiles}
      />
      {files.length > 0 && (
        <Switch
          mb="xs"
          checked={sensitive}
          onChange={(event) => setSensitive(event.currentTarget.checked)}
          label={t("editToot.sensitiveLabel", "Mark media as sensitive")}
        />
      )}
      {hasPoll && (
        <PollInput
          values={pollOptions}
          onChange={pollHandlers.setItem}
          onAdd={() => pollHandlers.append("")}
          onRemove={pollHandlers.remove}
          multiple={pollMultiple}
          setMultiple={setPollMultiple}
          expiresIn={pollExpiresIn}
          setExpiresIn={setPollExpiresIn}
        />
      )}
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
    </Modal>
  );
};
