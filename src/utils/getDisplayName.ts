import { prepareTextForRender } from "./prepareTextContent";

export const getDisplayName = (account: Entity.Account) => {
  return prepareTextForRender(
    account.display_name || account.username,
    account.emojis,
  );
};
