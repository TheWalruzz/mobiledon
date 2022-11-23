import React, { FC, useCallback } from "react";
import { Spoiler, Text, TypographyStylesProvider } from "@mantine/core";
import { prepareTextForRender } from "../../utils/prepareTextContent";
import { InnerHTML } from "../utils/InnerHTML";
import { MediaGrid } from "../layout/MediaGrid";
import { useTranslation } from "react-i18next";
import { Poll } from "../layout/Poll";
import { getApiClient } from "../../utils/getApiClient";

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
  const { t } = useTranslation();

  const onPollSubmit = useCallback(
    async (values: number[]) => {
      const apiClient = await getApiClient();
      await apiClient.votePoll(toot.poll?.id!, values);
      onUpdate();
    },
    [onUpdate, toot.poll?.id],
  );

  return (
    <>
      <TypographyStylesProvider>
        {toot.spoiler_text && (
          <Text mb="xs" onClick={onContentClick}>
            <InnerHTML component="p">
              {prepareTextForRender(toot.spoiler_text, toot)}
            </InnerHTML>
          </Text>
        )}
        <Spoiler
          maxHeight={toot.spoiler_text ? 0 : 150}
          showLabel={t("common.show", "Show")}
          hideLabel={t("common.hide", "Hide")}
          mb="xs"
        >
          <InnerHTML component="div" onClick={onContentClick}>
            {prepareTextForRender(toot.content, toot)}
          </InnerHTML>
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
