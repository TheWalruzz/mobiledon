interface TextOptions {
  emojis: Entity.Emoji[];
  mentions: Entity.Mention[];
  tags: Entity.Tag[];
}

export const prepareTextForRender = (
  text: string,
  { emojis = [], mentions = [], tags = [] }: Partial<TextOptions>,
) => {
  let newText = text;

  emojis.forEach((emoji) => {
    newText = newText.replaceAll(
      `:${emoji.shortcode}:`,
      `<img alt=":${emoji.shortcode}:" src="${emoji.url}" width="16px" height="16px" />`,
    );
  });

  mentions.forEach((mention) => {
    newText = newText.replaceAll(
      mention.url,
      `${window.location.origin}/user/${mention.acct}`,
    );
  });

  tags.forEach((tag) => {
    newText = newText.replaceAll(
      tag.url,
      `${window.location.origin}/tag/${tag.name}`,
    );
  });

  return newText;
};
