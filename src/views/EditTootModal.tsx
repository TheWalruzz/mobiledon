import React, { FC, useCallback, useEffect, useState } from "react";
import {
  ContextModalProps,
  openConfirmModal,
  openContextModal,
} from "@mantine/modals";
import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Menu,
  Paper,
  Spoiler,
  Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { RichTextEditor } from "@mantine/tiptap";
import { TootHeader } from "../components/toot/TootHeader";
import { TootContent } from "../components/toot/TootContent";
import { Visibility, VisibilityIcon } from "../components/VisibilityIcon";
import { suggestion } from "../components/editor/Suggestion";

interface EditTootModalProps extends Record<string, unknown> {
  toot?: Entity.Status;
  initialValue?: string;
  initialVisibility?: Visibility;
  onSubmit: (text: string, options?: Record<string, any>) => void;
}

const iconSize = 18;

export const EditTootModal: FC<ContextModalProps<EditTootModalProps>> = ({
  context,
  id,
  innerProps: {
    toot,
    initialValue = "",
    initialVisibility = "public",
    onSubmit,
  },
}) => {
  const { t } = useTranslation();
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);
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

  const onClose = useCallback(() => {
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
          context.closeModal(id);
        },
      });
      return;
    }

    context.closeModal(id);
  }, [context, id, t, editor]);

  const handleSubmit = useCallback(() => {
    onSubmit(editor?.getText() ?? "", { visibility });
    context.closeModal(id);
  }, [context, id, onSubmit, editor, visibility]);

  useEffect(() => {
    editor?.commands.focus();
  }, [editor]);

  return (
    <>
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
      <Group mb="xs">
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
              Public
            </Menu.Item>
            <Menu.Item
              icon={<VisibilityIcon visibility="unlisted" size={iconSize} />}
              onClick={() => setVisibility("unlisted")}
            >
              Unlisted
            </Menu.Item>
            <Menu.Item
              icon={<VisibilityIcon visibility="private" size={iconSize} />}
              onClick={() => setVisibility("private")}
            >
              Private
            </Menu.Item>
            <Menu.Item
              icon={<VisibilityIcon visibility="direct" size={iconSize} />}
              onClick={() => setVisibility("direct")}
            >
              Direct
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Flex justify="end">
        <Group>
          <Button variant="default" onClick={onClose}>
            {t("common.cancel", "Cancel")}
          </Button>
          <Button onClick={handleSubmit}>
            {t("editToot.submitLabel", "Toot!")}
          </Button>
        </Group>
      </Flex>
    </>
  );
};

export const openEditTootModal = (title: string, props: EditTootModalProps) =>
  openContextModal({
    modal: "editToot",
    title: <Text fw={700}>{title}</Text>,
    withCloseButton: false,
    centered: true,
    innerProps: props,
  });
