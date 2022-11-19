import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import TimeAgo from "javascript-time-ago";
import { Device } from "@capacitor/device";
import { Preferences } from "@capacitor/preferences";

import timeAgoEN from "javascript-time-ago/locale/en.json";
import timeAgoPL from "javascript-time-ago/locale/pl.json";
import en from "./locales/en.json";
import pl from "./locales/pl.json";

TimeAgo.addDefaultLocale(timeAgoEN);
TimeAgo.addLocale(timeAgoPL);

const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lang: string) => void) => {
    const { value: storedLang } = await Preferences.get({ key: "language" });
    if (storedLang) {
      callback(storedLang);
      return;
    }

    const { value } = await Device.getLanguageCode();
    callback(value || "en");
  },
  init: () => {},
  cacheUserLanguage: (lang: string) => {
    Preferences.set({ key: "language", value: lang });
  },
};

const resources = {
  en,
  pl,
};

i18n
  .use(languageDetector as any)
  .use(initReactI18next)
  .init({
    resources: Object.keys(resources).reduce((agg, currentKey) => {
      agg[currentKey] = {
        translation: resources[currentKey as keyof typeof resources],
      };
      return agg;
    }, {} as any),
    fallbackLng: "en",
    supportedLngs: ["en", "pl"],
    interpolation: {
      escapeValue: false,
    },
  });
