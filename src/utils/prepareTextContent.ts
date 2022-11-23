export const prepareTextForRender = (text: string, emojis: Entity.Emoji[]) => {
  let newText = text;

  emojis.forEach((emoji) => {
    newText = newText.replaceAll(
      `:${emoji.shortcode}:`,
      `<img alt=":${emoji.shortcode}:" src="${emoji.url}" width="16px" height="16px" />`,
    );
  });

  return newText;
};
