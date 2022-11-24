import { Preferences } from "@capacitor/preferences";
import { login, MastoClient } from "masto";

let cachedClient: MastoClient;

export const getApiClient = async (bustCache: boolean = false) => {
  if (!cachedClient || bustCache) {
    const instanceUrl = await Preferences.get({ key: "instanceUrl" });
    const accessToken = await Preferences.get({ key: "accessToken" });

    cachedClient = await login({
      url: instanceUrl.value!,
      accessToken: accessToken.value || undefined,
    });
  }

  return cachedClient;
};
