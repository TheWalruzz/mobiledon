import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, Transition } from "@mantine/core";
import { TootContent } from "./TootContent";
import { TootHeader } from "./TootHeader";
import { TootFooter } from "./TootFooter";
import { useAppContext } from "../../contexts/AppContext";
import { Status } from "masto";

interface TootProps {
  toot: Status;
  onUpdate: (id: string) => void;
  onRemove: (id: string) => void;
}

export const Toot: FC<TootProps> = ({ toot, onUpdate, onRemove }) => {
  const { apiClient } = useAppContext();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const currentToot = useMemo(() => toot.reblog ?? toot, [toot]);

  const onContentClick = useCallback(async () => {
    if (currentToot.inReplyToId) {
      const context = await apiClient.statuses.fetchContext(
        currentToot.inReplyToId,
      );
      if (context.ancestors.length > 0) {
        navigate(`/toot/${context.ancestors[0].id}`);
      } else {
        navigate(`/toot/${currentToot.inReplyToId}`);
      }

      return;
    }

    navigate(`/toot/${currentToot.id}`);
  }, [currentToot.inReplyToId, currentToot.id, navigate, apiClient]);

  const handleUpdate = useCallback(() => {
    onUpdate(toot.id);
  }, [onUpdate, toot.id]);

  const handleRemove = useCallback(() => {
    onRemove(toot.id);
  }, [onRemove, toot.id]);

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
          <TootContent
            toot={currentToot}
            onUpdate={handleUpdate}
            onContentClick={onContentClick}
          />
          <TootFooter
            toot={toot}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </Paper>
      )}
    </Transition>
  );
};
