import { sanitize } from "dompurify";
import { Emoji } from "masto";

export const prepareTextForRender = (text: string, emojis: Emoji[]) => {
  let newText = text;

  emojis.forEach((emoji) => {
    newText = newText.replaceAll(
      `:${emoji.shortcode}:`,
      `<img alt=":${emoji.shortcode}:" src="${emoji.url}" width="16px" height="16px" />`,
    );
  });

  return sanitize(newText);
};

export const clearContent = (text: string) => {
  return sanitize(text.replaceAll("</p>", "</p>\n"), {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });
};
