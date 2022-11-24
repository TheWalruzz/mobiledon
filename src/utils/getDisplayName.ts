import { Account } from "masto";
import { prepareTextForRender } from "./prepareTextContent";

export const getDisplayName = (account: Account) => {
  return prepareTextForRender(
    account.displayName || account.username,
    account.emojis,
  );
};
