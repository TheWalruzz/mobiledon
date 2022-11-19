import React, { FC, useMemo } from "react";
import {
  Avatar,
  createStyles,
  Flex,
  Stack,
  TypographyStylesProvider,
  Text,
  Indicator,
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
}));

export const TootHeader: FC<TootHeaderProps> = ({
  toot,
  hideDate = false,
  hideReblog = false,
}) => {
  const { t, i18n } = useTranslation();

  const { classes } = useStyles();
  const createdAt = useMemo(() => new Date(toot.created_at), [toot]);

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
          to={`/user/@${toot.reblog?.account?.acct ?? toot.account.acct}`}
          title={toot.reblog?.account?.acct ?? toot.account.acct}
        >
          <Flex gap="xs" direction="row" align="center" mb="sm">
            <Indicator
              size={16}
              position="bottom-center"
              disabled={!(toot.reblog?.account?.bot ?? toot.account.bot)}
              label="BOT"
              color="gray"
              withBorder
              inline
            >
              <Avatar
                h="100%"
                src={toot.reblog?.account?.avatar ?? toot.account.avatar}
                alt={toot.reblog?.account?.username ?? toot.account.username}
                mb={0}
              />
            </Indicator>

            <Stack spacing={0} style={{ flexGrow: 1 }}>
              <Text fw={600} className={classes.underline}>
                <InnerHTML>
                  {toot.reblog
                    ? getDisplayName(toot.reblog.account)
                    : getDisplayName(toot.account)}
                </InnerHTML>
              </Text>
              <Text c="dimmed" opacity={0.8}>
                @{toot.reblog?.account?.acct ?? toot.account.acct}
              </Text>
            </Stack>
            {!hideDate && (
              <>
                <Text c="dimmed" opacity={0.8} style={{ display: "flex" }}>
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
              </>
            )}
          </Flex>
        </Link>
      </TypographyStylesProvider>
    </div>
  );
};
