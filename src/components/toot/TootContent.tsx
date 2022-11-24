import React, { FC, useCallback } from "react";
import { Spoiler, Text, TypographyStylesProvider } from "@mantine/core";
import { MediaGrid } from "../layout/MediaGrid";
import { useTranslation } from "react-i18next";
import { Poll } from "../layout/Poll";
import { ParsedContent } from "./ParsedContent";
import { useAppContext } from "../../contexts/AppContext";

interface TootContentProps {
  toot: Entity.Status;
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
      await apiClient.votePoll(toot.poll?.id!, values);
      onUpdate();
    },
    [apiClient, onUpdate, toot.poll?.id],
  );

  return (
    <>
      <TypographyStylesProvider>
        {toot.spoiler_text && (
          <Text mb="xs" onClick={onContentClick}>
            <ParsedContent html={toot.content} context={toot} />
          </Text>
        )}
        <Spoiler
          maxHeight={toot.spoiler_text ? 0 : 150}
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
      {toot.media_attachments.length > 0 && (
        <MediaGrid items={toot.media_attachments} sensitive={toot.sensitive} />
      )}
    </>
  );
};
