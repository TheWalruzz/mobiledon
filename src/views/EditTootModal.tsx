import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import RichTextEditor, { Editor } from "@mantine/rte";
import { TootHeader } from "../components/toot/TootHeader";
import { TootContent } from "../components/toot/TootContent";
import { getApiClient } from "../utils/getApiClient";
import { prepareStatusForPost } from "../utils/prepareTextContent";
import { Visibility, VisibilityIcon } from "../components/VisibilityIcon";
import { useTranslation } from "react-i18next";

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
  const editorRef = useRef<Editor>();
  const [text, setText] = useState(initialValue);
  const [visibility, setVisibility] = useState<Visibility>(initialVisibility);

  const onClose = useCallback(() => {
    if (text) {
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
  }, [context, id, t, text]);

  const handleSubmit = useCallback(() => {
    onSubmit(prepareStatusForPost(text), { visibility });
    context.closeModal(id);
  }, [context, id, onSubmit, text, visibility]);

  // TODO: fix mentions' output
  const mentions = useMemo(
    () => ({
      // TODO: add avatars to the list
      // TODO: fix z-index on the list (it clashes with the buttons, somehow)
      allowedChars: /^[\p{L}\p{N}_]*$/u,
      mentionDenotationChars: ["@", "#"],
      defaultMenuOrientation: "top",
      dataAttributes: [],
      source: async (
        searchTerm: string,
        renderList: (items: any[]) => void,
        mentionChar: string,
      ) => {
        if (!searchTerm) {
          return;
        }

        const searchType = mentionChar === "@" ? "accounts" : "hashtags";

        const apiClient = await getApiClient();
        const results = await apiClient.search(searchTerm, searchType, {
          limit: 5,
        });
        renderList(
          results.data[searchType].map((item: any) => ({
            id: item.id ?? item.name,
            value: item.acct ?? item.name,
          })),
        );
      },
    }),
    [],
  );

  const modules = useMemo(
    () => ({
      toolbar: false,
      syntax: false,
    }),
    [],
  );

  useEffect(() => {
    editorRef.current?.focus();
  }, []);

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
      <RichTextEditor
        ref={editorRef as any}
        value={text}
        onChange={setText}
        controls={[]}
        formats={["mention"]}
        mb="sm"
        mentions={mentions}
        modules={modules}
        sticky={false}
        styles={{ toolbar: { display: "none" } }}
        h={200}
      />
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
