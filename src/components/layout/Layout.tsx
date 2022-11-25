import React from "react";
import { AppShell, LoadingOverlay } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppNavbar } from "./AppNavbar";
import { AppFooter } from "./AppFooter";
import { useInitializeApi } from "../../hooks/useInitializeApi";

export const Layout = () => {
  const initialized = useInitializeApi();

  return initialized ? (
    <AppShell
      styles={{ main: { height: "calc(100vh - 120px)" } }}
      header={<AppHeader />}
      footer={<AppFooter />}
      padding={0}
    >
      <AppNavbar />
      <Outlet />
    </AppShell>
  ) : (
    <LoadingOverlay visible />
  );
};
