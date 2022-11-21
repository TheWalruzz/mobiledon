import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { SuggestionProps } from "@tiptap/suggestion";
import { Button, Paper, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface MentionListProps extends SuggestionProps {}

export const MentionList: FC<MentionListProps> = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length,
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <Paper withBorder shadow="sm">
      <Stack spacing="xs" my="xs">
        {props.items.length ? (
          props.items.map((item, index) => (
            <Button
              variant="subtle"
              compact
              color={index === selectedIndex ? "red" : undefined}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </Button>
          ))
        ) : (
          <Text fw={700} align="center">
            {t("common.noResults", "No results")}
          </Text>
        )}
      </Stack>
    </Paper>
  );
});
