import React, { FC } from "react";
import { Spoiler, Text, TypographyStylesProvider } from "@mantine/core";
import { prepareTextForRender } from "../../utils/prepareTextContent";
import { InnerHTML } from "../InnerHTML";
import { MediaGrid } from "../MediaGrid";
import { useTranslation } from "react-i18next";

interface TootContentProps {
  toot: Entity.Status;
  onContentClick: () => void;
}

export const TootContent: FC<TootContentProps> = ({ toot, onContentClick }) => {
  const { t } = useTranslation();

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
          maxHeight={toot.spoiler_text ? 0 : 300}
          showLabel={t("common.show", "Show")}
          hideLabel={t("common.hide", "Hide")}
          mb="xs"
        >
          <InnerHTML component="div" onClick={onContentClick}>
            {prepareTextForRender(toot.content, toot)}
          </InnerHTML>
        </Spoiler>
      </TypographyStylesProvider>
      {toot.media_attachments.length > 0 && (
        <MediaGrid items={toot.media_attachments} sensitive={toot.sensitive} />
      )}
    </>
  );
};
