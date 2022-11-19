import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { getApiClient } from "../utils/getApiClient";
import { Center, Loader, Paper } from "@mantine/core";

export const AuthHandler = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const code = params.get("code");
      if (code) {
        try {
          const apiClient = await getApiClient(true);
          const clientId = await Preferences.get({ key: "clientId" });
          const clientSecret = await Preferences.get({ key: "clientSecret" });
          const tokenData = await apiClient.fetchAccessToken(
            clientId.value,
            clientSecret.value!,
            code,
            // TODO: check this for Android and make it work if necessary
            `${window.location.origin}/auth`,
          );
          await Preferences.set({
            key: "accessToken",
            value: tokenData.accessToken,
          });
          await Preferences.set({
            key: "refreshToken",
            value: tokenData.refreshToken!,
          });
          navigate("/");
        } catch {
          // TODO: add error handling to requests
        }
      } else {
        // TODO: error handling
        console.error("Code was not returned!");
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
