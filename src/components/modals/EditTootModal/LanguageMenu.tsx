import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { Menu, TextInput } from "@mantine/core";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import codes from "iso-language-codes";

const languageCodes = codes
  .map((lang) => ({
    id: lang.iso639_1,
    value: `${lang.nativeName} (${lang.name})`,
  }))
  .sort((a, b) => a.id.localeCompare(b.id));

interface LanguageMenuProps extends PropsWithChildren {
  onChange: (value: string) => void;
}

export const LanguageMenu: FC<LanguageMenuProps> = ({ children, onChange }) => {
  const { t } = useTranslation();
  const [codes, setCodes] = useState(languageCodes);
  const [search, setSearch] = useInputState("");
  const [debouncedSearch] = useDebouncedValue(search, 100);

  useEffect(() => {
    setCodes(
      languageCodes
        .filter(
          (code) =>
            code.value
              .toLocaleLowerCase()
              .includes(debouncedSearch.toLocaleLowerCase()) ||
            code.id.includes(debouncedSearch.toLocaleLowerCase()),
        )
        .slice(0, 5),
    );
  }, [debouncedSearch]);

  return (
    <Menu>
      <Menu.Target>{children}</Menu.Target>

      <Menu.Dropdown>
        <TextInput
          value={search}
          onChange={setSearch}
          placeholder={t("common.search", "Search...")}
        />
        {codes.map((code) => (
          <Menu.Item key={code.id} onClick={() => onChange(code.id)}>
            {code.value}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};
