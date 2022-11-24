import React, { FC, useCallback } from "react";
import { Spoiler, Text, TypographyStylesProvider } from "@mantine/core";
import { MediaGrid } from "../layout/MediaGrid";
import { useTranslation } from "react-i18next";
import { Poll } from "../layout/Poll";
import { ParsedContent } from "./ParsedContent";
import { useAppContext } from "../../contexts/AppContext";
import { Status } from "masto";

interface TootContentProps {
  toot: Status;
  onContentClick: () => void;
  onUpdate: () => void;
  readOnly?: boolean;
}

export const TootContent: FC<TootContentProps> = ({
  toot,
  onContentClick,
  onUpdate,
  readOnly = false,
}) => {
  const { apiClient } = useAppContext();
  const { t } = useTranslation();

  const onPollSubmit = useCallback(
    async (values: number[]) => {
      await apiClient.poll.vote(toot.poll?.id!, {
        choices: values.map(String),
      });
      onUpdate();
    },
    [apiClient, onUpdate, toot.poll?.id],
  );

  return (
    <>
      <TypographyStylesProvider>
        {toot.spoilerText && (
          <Text mb="xs" onClick={onContentClick}>
            <ParsedContent html={toot.content} context={toot} />
          </Text>
        )}
        <Spoiler
          maxHeight={toot.spoilerText ? 0 : 150}
          showLabel={t("common.show", "Show")}
          hideLabel={t("common.hide", "Hide")}
          mb="xs"
        >
          <ParsedContent
            html={toot.content}
            context={toot}
            onClick={onContentClick}
          />
          {toot.poll && (
            <Poll
              poll={toot.poll}
              onSubmit={onPollSubmit}
              disableSubmit={readOnly}
            />
          )}
        </Spoiler>
      </TypographyStylesProvider>
      {toot.mediaAttachments.length > 0 && (
        <MediaGrid items={toot.mediaAttachments} sensitive={toot.sensitive} />
      )}
    </>
  );
};
