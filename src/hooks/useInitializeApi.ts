import { useEffect, useRef, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import { getApiClient } from "../utils/getApiClient";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";

export const useInitializeApi = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
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
          const userResponse = await apiClient.verifyAccountCredentials();
          setUser(userResponse.data);
          setInitialized(true);
          return;
        }
      } catch {
        console.log("Access revoked, redirecting to login page...");
      }

      navigate("/login");
    })();
  }, [navigate, setUser, initialized]);

  return initialized;
};
