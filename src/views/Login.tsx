import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Center,
  Container,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { IconBrandMastodon } from "@tabler/icons";
import validator from "validator";
import normalizeUrl from "normalize-url";
import { Preferences } from "@capacitor/preferences";
import { getApiClient } from "../utils/getApiClient";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { t } = useTranslation();
  const [instanceUrl, setInstanceUrl] = useState<string>("");

  const isValidUrl = useMemo(() => validator.isURL(instanceUrl), [instanceUrl]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setInstanceUrl(event.target.value),
    [setInstanceUrl],
  );

  const onSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (isValidUrl) {
        const normalizedUrl = normalizeUrl(instanceUrl, {
          defaultProtocol: "https",
        });
        await Preferences.set({ key: "instanceUrl", value: normalizedUrl });
        const client = await getApiClient();

        const appData = await client.registerApp("Mobiledon", {
          scopes: ["read", "write", "follow", "push"],
          // TODO: check this for Android and make it work if necessary
          redirect_uris: `${window.location.origin}/auth`,
          website: "https://radej.dev",
        });
        await Preferences.set({ key: "clientId", value: appData.clientId });
        await Preferences.set({
          key: "clientSecret",
          value: appData.clientSecret,
        });
        if (appData.url) {
          window.location.assign(appData.url);
        }
      }
    },
    [instanceUrl, isValidUrl],
  );

  return (
    <Paper w="100vw" h="100vh" p="md">
      <Container>
        <Center mb="sm">
          <IconBrandMastodon size={64} />
          <Title ml="sm" order={1}>
            Login
          </Title>
        </Center>
        <form onSubmit={onSubmit}>
          <Stack>
            <TextInput
              label={t("login.instanceUrl", "Instance URL")}
              placeholder="https://mastodon.social"
              onChange={onChange}
              value={instanceUrl}
              error={
                instanceUrl &&
                !isValidUrl &&
                t("common.errors.invalidUrl", "Invalid URL")
              }
            />
            <Button type="submit" disabled={!isValidUrl}>
              {t("common.continue", "Continue")}
            </Button>
          </Stack>
        </form>
      </Container>
    </Paper>
  );
};
