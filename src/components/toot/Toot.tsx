import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Paper, Transition } from "@mantine/core";
import { TootContent } from "./TootContent";
import { TootHeader } from "./TootHeader";
import { TootFooter } from "./TootFooter";
import { useNavigate } from "react-router-dom";
import { getApiClient } from "../../utils/getApiClient";

interface TootProps {
  toot: Entity.Status;
  onUpdate: (id: string) => void;
}

export const Toot: FC<TootProps> = ({ toot, onUpdate }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const currentToot = useMemo(() => toot.reblog ?? toot, [toot]);

  const onContentClick = useCallback(async () => {
    if (currentToot.in_reply_to_id) {
      const apiClient = await getApiClient();
      const context = await apiClient.getStatusContext(
        currentToot.in_reply_to_id,
      );
      if (context.data.ancestors.length > 0) {
        navigate(`/toot/${context.data.ancestors[0].id}`);
      } else {
        navigate(`/toot/${currentToot.in_reply_to_id}`);
      }

      return;
    }

    navigate(`/toot/${currentToot.id}`);
  }, [navigate, currentToot]);

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
          shadow="xs"
          radius={0}
          p="xs"
          withBorder
          mt={-1}
          style={{ width: "100vw", overflow: "hidden", ...styles }}
          id={currentToot.id}
        >
          <TootHeader toot={toot} />
          <TootContent toot={currentToot} onContentClick={onContentClick} />
          <TootFooter toot={toot} onUpdate={onUpdate} />
        </Paper>
      )}
    </Transition>
  );
};
