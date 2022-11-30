import React, { FC, useCallback } from "react";
import { Account } from "masto";
import { AsyncList } from "../utils/AsyncList";
import { UserItem } from "./UserItem";

interface UserListProps {
  fetchData: (lastFetchedId?: string) => Promise<Account[]>;
}

export const UserList: FC<UserListProps> = ({ fetchData }) => {
  const getId = useCallback((item: Account) => item.id, []);

  return (
    <AsyncList<Account> fetchData={fetchData} getId={getId}>
      {(item) => <UserItem user={item} />}
    </AsyncList>
  );
};
