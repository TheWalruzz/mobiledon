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
import { useTranslation } from "react-i18next";
import { getApiClient } from "../../utils/getApiClient";
import qs from "qs";

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

        const appData = await client.apps.create({
          clientName: "Mobiledon",
          scopes: "read write follow push",
          redirectUris: `${window.location.origin}/auth`,
          website: "https://radej.dev",
        });
        await Preferences.set({ key: "clientId", value: appData.clientId! });
        await Preferences.set({
          key: "clientSecret",
          value: appData.clientSecret!,
        });
        const url = `${normalizedUrl}/oauth/authorize?${qs.stringify({
          response_type: "code",
          client_id: appData.clientId!,
          client_secret: appData.clientSecret!,
          scope: "read write follow push",
          redirect_uri: `${window.location.origin}/auth`,
        })}`;

        window.location.assign(url);
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
