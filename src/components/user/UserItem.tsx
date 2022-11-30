import React, { FC, useCallback, useEffect, useState } from "react";
import { Account } from "masto";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Group,
  Indicator,
  Paper,
  Stack,
  Transition,
  Text,
} from "@mantine/core";
import { getDisplayName } from "../../utils/getDisplayName";
import { InnerHTML } from "../utils/InnerHTML";

interface UserItemProps {
  user: Account;
}

export const UserItem: FC<UserItemProps> = ({ user }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  const onClick = useCallback(() => {
    navigate(`/user/${user.acct}`);
  }, [navigate, user.acct]);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Transition
      mounted={loaded}
      transition="fade"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <Paper
          onClick={onClick}
          shadow="xs"
          radius={0}
          p="xs"
          withBorder
          mt={-1}
          style={{ width: "100vw", overflow: "hidden", ...styles }}
        >
          <Group>
            <Indicator
              size={16}
              position="bottom-center"
              disabled={!user?.bot}
              label="BOT"
              color="gray"
              withBorder
              inline
            >
              <Avatar src={user.avatar} alt={user.username} />
            </Indicator>
            <Stack spacing={0} style={{ minWidth: 0 }} p="xs">
              <Text fw={600} lineClamp={1} fz="sm">
                <InnerHTML>{getDisplayName(user)}</InnerHTML>
              </Text>
              <Text c="dimmed" opacity={0.8} lineClamp={1} fz="sm">
                @{user.acct}
              </Text>
            </Stack>
          </Group>
        </Paper>
      )}
    </Transition>
  );
};
