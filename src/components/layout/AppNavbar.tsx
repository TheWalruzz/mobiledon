import React, { useCallback, useMemo } from "react";
import { Drawer, NavLink as Link, Divider, Avatar } from "@mantine/core";
import { useAppContext } from "../../contexts/AppContext";
import { IconLogout, IconSettings } from "@tabler/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { Preferences } from "@capacitor/preferences";
import { useTranslation } from "react-i18next";

export const AppNavbar = () => {
  const { t } = useTranslation();
  const { isNavbarOpen, setNavbarOpen, user } = useAppContext();
  const navigate = useNavigate();

  const onClose = useCallback(() => setNavbarOpen(false), [setNavbarOpen]);

  const topLinks = useMemo(
    () => [
      {
        label: t("nav.viewProfile", "View Profile"),
        icon: <Avatar src={user.avatar} size="sm" />,
        to: `/user/${user.acct}`,
      },
    ],
    [t, user.acct, user.avatar],
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

  // TODO: fix the logout!
  // currently, it throws cors errors...
  const onLogout = useCallback(async () => {
    const { value: instanceUrl } = await Preferences.get({
      key: "instanceUrl",
    });
    const { value: clientId } = await Preferences.get({ key: "clientId" });
    const { value: clientSecret } = await Preferences.get({
      key: "clientSecret",
    });
    const { value: accessToken } = await Preferences.get({
      key: "accessToken",
    });
    try {
      const result = await fetch(`${instanceUrl}/oauth/revoke/`, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          token: accessToken,
        }),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(result);
      return;
    } catch (e) {
      console.error(e);
    }
    await Preferences.remove({ key: "clientId" });
    await Preferences.remove({ key: "clientSecret" });
    await Preferences.remove({ key: "accessToken" });
    await Preferences.remove({ key: "instanceUrl" });
    navigate("/");
  }, [navigate]);

  return (
    <Drawer
      opened={isNavbarOpen}
      onClose={onClose}
      withCloseButton={false}
      padding="xs"
    >
      {topLinks.map((item, i) => (
        <Link
          key={`topLinks-${i}`}
          component={NavLink}
          onClick={onClose}
          {...item}
        />
      ))}
      <Divider my="xs" />
      {bottomLinks.map((item, i) => (
        <Link
          key={`bottomLinks-${i}`}
          component={NavLink}
          onClick={onClose}
          {...item}
        />
      ))}
      <Link
        label={t("nav.logout", "Logout")}
        icon={<IconLogout />}
        onClick={onLogout}
      />
    </Drawer>
  );
};
