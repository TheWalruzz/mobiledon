import { Preferences } from "@capacitor/preferences";
import megalodon, { MegalodonInterface } from "megalodon";

let cachedClient: MegalodonInterface;

export const getApiClient = async (bustCache: boolean = false) => {
  if (!cachedClient || bustCache) {
    const instanceUrl = await Preferences.get({ key: "instanceUrl" });
    const accessToken = await Preferences.get({ key: "accessToken" });

    cachedClient = megalodon(
      "mastodon",
      instanceUrl.value!,
      accessToken.value || undefined,
    );
  }

  return cachedClient;
};
