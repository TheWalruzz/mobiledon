import React, { FC, useMemo } from "react";
import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconX } from "@tabler/icons";

interface PollInputProps {
  values: string[];
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onAdd: () => void;
  multiple: boolean;
  setMultiple: (value: boolean) => void;
  expiresIn: number;
  setExpiresIn: (value: number) => void;
}

export const PollInput: FC<PollInputProps> = ({
  values,
  onChange,
  onRemove,
  onAdd,
  multiple,
  setMultiple,
  expiresIn,
  setExpiresIn,
}) => {
  const { t } = useTranslation();
  const expiresInOptions = useMemo(
    () => [
      {
        value: String(5 * 60),
        label: t("poll.expirationTimes.5Minutes", "5 Minutes"),
      },
      {
        value: String(30 * 60),
        label: t("poll.expirationTimes.30Minutes", "30 Minutes"),
      },
      {
        value: String(60 * 60),
        label: t("poll.expirationTimes.1Hour", "1 Hour"),
      },
      {
        value: String(6 * 60 * 60),
        label: t("poll.expirationTimes.6Hours", "6 Hours"),
      },
      {
        value: String(24 * 60 * 60),
        label: t("poll.expirationTimes.1Day", "1 Day"),
      },
      {
        value: String(3 * 24 * 60 * 60),
        label: t("poll.expirationTimes.3Days", "3 Days"),
      },
      {
        value: String(7 * 24 * 60 * 60),
        label: t("poll.expirationTimes.7Days", "7 Days"),
      },
    ],
    [t],
  );

  return (
    <Paper withBorder p="xs" mb="xs">
      <Stack spacing="xs">
        {values.map((value, i) => (
          <Group key={`poll--${i}`} spacing="xs">
            <TextInput
              value={value}
              onChange={(e) => onChange(i, e.currentTarget.value)}
              placeholder={
                t("poll.option", "Option {{index}}", { index: i + 1 })!
              }
              style={{ flexGrow: 1 }}
            />
            {values.length > 1 && (
              <ActionIcon style={{ flexShrink: 0 }} onClick={() => onRemove(i)}>
                <IconX />
              </ActionIcon>
            )}
          </Group>
        ))}
        <Button onClick={onAdd}>{t("poll.addOption", "Add Option")}</Button>
        <Select
          value={String(expiresIn)}
          onChange={(value) => setExpiresIn(Number(value))}
          data={expiresInOptions}
          label={t("poll.expiresIn", "Expires in")}
        />
        <Switch
          checked={multiple}
          onChange={(e) => setMultiple(e.currentTarget.checked)}
          label={t("poll.allowMultiple", "Allow multiple answers")}
        />
      </Stack>
    </Paper>
  );
};
