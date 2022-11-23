import React, { FC, useCallback, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  createStyles,
  List,
  Paper,
  Progress,
  Radio,
  Stack,
  Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import ReactTimeAgo from "react-time-ago";

const useStyles = createStyles(() => ({
  listItem: {
    "& .mantine-List-itemIcon": {
      minWidth: 34,
    },
    "& .mantine-List-itemWrapper": {
      alignItems: "center",
    },
    "& .mantine-List-itemWrapper, & .mantine-List-itemWrapper span:last-child":
      {
        width: "100%",
      },
  },
}));

interface PollProps {
  poll: Entity.Poll;
  onSubmit: (values: number[]) => void;
  disableSubmit: boolean;
}

export const Poll: FC<PollProps> = ({
  poll,
  onSubmit,
  disableSubmit = false,
}) => {
  const { classes } = useStyles();
  const { t, i18n } = useTranslation();
  const [answers, setAnswers] = useState<string[]>([]);
  const PollComponent = useMemo(
    () => (poll.multiple ? Checkbox : Radio),
    [poll.multiple],
  );

  const pollExpirationDate = useMemo(() => new Date(poll.expires_at!), [poll]);

  const handleSubmit = useCallback(() => {
    onSubmit(answers.map((answer) => Number(answer)));
  }, [answers, onSubmit]);

  return (
    <Paper withBorder p="xs">
      <Stack spacing="xs">
        {poll.voted || poll.expired ? (
          <>
            <List spacing="xs" style={{ paddingLeft: 0 }}>
              {poll.options.map((option, i) => (
                <List.Item
                  key={`poll-${poll.id}--answer-${i}`}
                  style={{ width: "100%" }}
                  className={classes.listItem}
                  icon={
                    <Text size="sm">
                      {`${
                        poll.votes_count
                          ? (
                              ((option.votes_count || 0) / poll.votes_count) *
                              100
                            ).toFixed(0)
                          : 0
                      }%`}
                    </Text>
                  }
                >
                  <Text>{option.title}</Text>
                  <Progress
                    value={
                      +(
                        ((option.votes_count || 0) / poll.votes_count) *
                        100
                      ).toFixed(0)
                    }
                  />
                </List.Item>
              ))}
            </List>
            <Text c="dimmed">
              {t("poll.totalVoters", "Total votes: {{votes}}", {
                votes: poll.votes_count,
              })}
            </Text>
          </>
        ) : (
          <>
            <PollComponent.Group
              value={
                poll.multiple ? (answers as any) : (answers[0] as any) ?? null
              }
              orientation="vertical"
              onChange={(value) =>
                poll.multiple
                  ? setAnswers(value as any)
                  : setAnswers([value] as any)
              }
            >
              {poll.options.map((option, i) => (
                <PollComponent
                  key={`poll-${poll.id}--${i}`}
                  value={String(i)}
                  label={option.title}
                  disabled={disableSubmit}
                />
              ))}
            </PollComponent.Group>
            <Text c="dimmed" fz="xs">
              {t("poll.expiresShort", "Expires")}{" "}
              <ReactTimeAgo
                future
                date={pollExpirationDate}
                locale={i18n.language}
              />
            </Text>
            {!disableSubmit && (
              <Button disabled={answers.length === 0} onClick={handleSubmit}>
                {t("common.submit", "Submit")}
              </Button>
            )}
          </>
        )}
      </Stack>
    </Paper>
  );
};
