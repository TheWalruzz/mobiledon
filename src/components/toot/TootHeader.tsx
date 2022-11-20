import React, { FC, useMemo } from "react";
import {
  Avatar,
  createStyles,
  Flex,
  Stack,
  TypographyStylesProvider,
  Text,
  Indicator,
  Group,
  clsx,
} from "@mantine/core";
import { Link } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import { IconExchange } from "@tabler/icons";
import { getDisplayName } from "../../utils/getDisplayName";
import { InnerHTML } from "../InnerHTML";
import { VisibilityIcon } from "../VisibilityIcon";
import { useTranslation } from "react-i18next";

interface TootHeaderProps {
  toot: Entity.Status;
  hideDate?: boolean;
  hideReblog?: boolean;
}

const visibilityIconSize = 18;

const useStyles = createStyles((theme, _params, getRef) => ({
  header: {
    "& a:hover": {
      textDecoration: "none !important",
    },

    [`& a:hover .${getRef("underline")}`]: {
      textDecoration: "underline",
    },

    "& img": {
      marginBottom: "0 !important",
    },
  },
  underline: {
    ref: getRef("underline"),
  },
  ellipsisFix: {
    display: "block",
  },
}));

export const TootHeader: FC<TootHeaderProps> = ({
  toot,
  hideDate = false,
  hideReblog = false,
}) => {
  const { t, i18n } = useTranslation();
  const { classes } = useStyles();
  const currentToot = useMemo(() => toot.reblog ?? toot, [toot]);
  const createdAt = useMemo(
    () => new Date(currentToot.created_at),
    [currentToot],
  );

  return (
    <div className={classes.header}>
      <TypographyStylesProvider>
        {!hideReblog && toot.reblog && (
          <Text mb="sm" c="dimmed" fw={600} opacity={0.8}>
            <Flex direction="row" align="center" gap={6}>
              <IconExchange size={visibilityIconSize} />
              <Link to={`/user/${toot.account.acct}`} title={toot.account.acct}>
                <Flex direction="row" align="center" gap={4}>
                  <Avatar
                    size="xs"
                    src={toot.account.avatar}
                    alt={toot.account.username}
                  />
                  <InnerHTML>{getDisplayName(toot.account)}</InnerHTML>
                </Flex>
              </Link>
              {t("toot.boosted", "boosted")}
            </Flex>
          </Text>
        )}
        <Link
          to={`/user/@${currentToot.account.acct}`}
          title={currentToot.account.acct}
        >
          <Flex gap="xs" direction="row" align="center" wrap="nowrap" mb="sm">
            <Indicator
              size={16}
              position="bottom-center"
              disabled={!currentToot.account.bot}
              label="BOT"
              color="gray"
              withBorder
              inline
            >
              <Avatar
                h="100%"
                src={currentToot.account.avatar}
                alt={currentToot.account.username}
                mb={0}
              />
            </Indicator>

            {/* TODO: add ellipsis for longer names */}
            <Stack spacing={0} style={{ flexGrow: 1, minWidth: 0 }}>
              <Text
                fw={600}
                className={clsx(classes.underline, classes.ellipsisFix)}
                lineClamp={1}
              >
                <InnerHTML>{getDisplayName(currentToot.account)}</InnerHTML>
              </Text>
              <Text
                c="dimmed"
                opacity={0.8}
                lineClamp={1}
                className={classes.ellipsisFix}
              >
                @{currentToot.account.acct}
              </Text>
            </Stack>
            {!hideDate && (
              <Group spacing="xs" style={{ flexShrink: 0 }}>
                <Text c="dimmed" opacity={0.8}>
                  <VisibilityIcon
                    visibility={toot.visibility}
                    size={visibilityIconSize}
                  />
                </Text>
                <Text c="dimmed" opacity={0.8}>
                  <ReactTimeAgo
                    date={createdAt}
                    locale={i18n.language}
                    timeStyle="twitter"
                  />
                </Text>
              </Group>
            )}
          </Flex>
        </Link>
      </TypographyStylesProvider>
    </div>
  );
};
