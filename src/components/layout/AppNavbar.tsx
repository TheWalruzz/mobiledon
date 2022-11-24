import React, { useCallback, useMemo } from "react";
import { Drawer, NavLink as Link, Divider } from "@mantine/core";
import { useAppContext } from "../../contexts/AppContext";
import { IconLogout, IconPencil, IconSettings } from "@tabler/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { useTranslation } from "react-i18next";

export const AppNavbar = () => {
  const { t } = useTranslation();
  const { isNavbarOpen, setNavbarOpen, apiClient } = useAppContext();
  const navigate = useNavigate();

  const onClose = useCallback(() => setNavbarOpen(false), [setNavbarOpen]);

  const topLinks = useMemo(
    () => [
      {
        label: t("nav.editProfile", "Edit Profile"),
        icon: <IconPencil />,
        to: "/",
      },
    ],
    [t],
  );

  const bottomLinks = useMemo(
    () => [
      {
        label: t("nav.settings", "Settings"),
        icon: <IconSettings />,
        to: "/",
      },
    ],
    [t],
  );

  const onLogout = useCallback(async () => {
    const { value: clientId } = await Preferences.get({ key: "clientId" });
    const { value: clientSecret } = await Preferences.get({
      key: "clientSecret",
    });
    const { value: accessToken } = await Preferences.get({
      key: "accessToken",
    });
    await apiClient.revokeToken(clientId!, clientSecret!, accessToken!);
    await Preferences.remove({ key: "clientId" });
    await Preferences.remove({ key: "clientSecret" });
    await Preferences.remove({ key: "accessToken" });
    await Preferences.remove({ key: "instanceUrl" });
    navigate("/");
  }, [apiClient, navigate]);

  return (
    <Drawer
      opened={isNavbarOpen}
      onClose={onClose}
      withCloseButton={false}
      padding="xs"
    >
      {topLinks.map((item, i) => (
        <Link key={`topLinks-${i}`} component={NavLink} {...item} />
      ))}
      <Divider my="xs" />
      {bottomLinks.map((item, i) => (
        <Link key={`bottomLinks-${i}`} component={NavLink} {...item} />
      ))}
      <Link
        label={t("nav.logout", "Logout")}
        icon={<IconLogout />}
        onClick={onLogout}
      />
    </Drawer>
  );
};
