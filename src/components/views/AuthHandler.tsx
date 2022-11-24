import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Center, Loader, Paper } from "@mantine/core";
import { Preferences } from "@capacitor/preferences";
import { getApiClient } from "../../utils/getApiClient";

export const AuthHandler = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ranOnce = useRef(false);

  useEffect(() => {
    (async () => {
      if (!ranOnce.current) {
        const code = params.get("code");
        if (code) {
          ranOnce.current = true;
          try {
            const apiClient = await getApiClient(true);
            const clientId = await Preferences.get({ key: "clientId" });
            const clientSecret = await Preferences.get({ key: "clientSecret" });
            const response = await (apiClient as any).http.post(
              "/oauth/token",
              {
                client_id: clientId.value,
                client_secret: clientSecret.value!,
                code,
                // TODO: check this for Android and make it work if necessary
                redirect_uri: `${window.location.origin}/auth`,
                grant_type: "authorization_code",
              },
            );
            await Preferences.set({
              key: "accessToken",
              value: response.accessToken,
            });
            await Preferences.set({
              key: "refreshToken",
              value: response.refreshToken!,
            });
            navigate("/");
          } catch {
            // TODO: add error handling to requests
          }
        } else {
          // TODO: error handling
          console.error("Code was not returned!");
        }
      }
    })();
  }, [params, navigate]);

  return (
    <Paper w="100vw" h="100vh">
      <Center>
        <Loader />
      </Center>
    </Paper>
  );
};
