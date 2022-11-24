import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { getApiClient } from "../utils/getApiClient";
import { useAppContext } from "../contexts/AppContext";

export const useInitializeApi = () => {
  const navigate = useNavigate();
  const { setUser, setApiClient, setStreams } = useAppContext();
  const [initialized, setInitialized] = useState(false);
  const hasRunOnce = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      if (hasRunOnce.current) {
        return;
      }

      hasRunOnce.current = true;

      const token = await Preferences.get({ key: "accessToken" });

      try {
        if (token.value) {
          const apiClient = await getApiClient(true);
          const userResponse = await apiClient.accounts.verifyCredentials();
          setUser(userResponse);
          setApiClient(apiClient);
          setStreams({
            user: await apiClient.stream.streamUser(),
            global: await apiClient.stream.streamPublicTimeline(),
            local: await apiClient.stream.streamCommunityTimeline(),
          });
          setInitialized(true);
          return;
        }
      } catch {
        console.log("Access revoked, redirecting to login page...");
      }

      await Preferences.remove({ key: "clientId" });
      await Preferences.remove({ key: "clientSecret" });
      await Preferences.remove({ key: "accessToken" });
      await Preferences.remove({ key: "instanceUrl" });

      navigate("/login");
    })();
  }, [navigate, setUser, initialized, setApiClient, setStreams]);

  return initialized;
};
