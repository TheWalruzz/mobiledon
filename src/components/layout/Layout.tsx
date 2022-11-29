import React, { useCallback } from "react";
import { ActionIcon, Affix, AppShell, LoadingOverlay } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AppHeader } from "./AppHeader";
import { AppNavbar } from "./AppNavbar";
import { AppFooter } from "./AppFooter";
import { useInitializeApi } from "../../hooks/useInitializeApi";
import { useAppContext } from "../../contexts/AppContext";
import { EditTootModalProps } from "../modals/EditTootModal";
import { IconPencil } from "@tabler/icons";
import { useCustomModal } from "../../contexts/CustomModalContext";
import { showNotification } from "@mantine/notifications";

export const Layout = () => {
  const { t } = useTranslation();
  const initialized = useInitializeApi();
  const { apiClient } = useAppContext();
  const { openCustomModal } = useCustomModal();

  const onSubmit = useCallback(
    async (text: string, options: Record<string, any> = {}) => {
      await apiClient.statuses.create({ status: text, ...options });
      showNotification({
        message: t("toot.postSuccessful", "Toot posted successfully."),
        autoClose: 3000,
        color: "green",
      });
    },
    [apiClient?.statuses, t],
  );

  const openEditTootModal = useCallback(() => {
    openCustomModal<EditTootModalProps>("editToot", {
      title: t("toot.newToot", "New Toot"),
      onSubmit,
    });
  }, [onSubmit, openCustomModal, t]);

  return initialized ? (
    <AppShell
      styles={{ main: { height: "calc(100vh - 120px)" } }}
      header={<AppHeader />}
      footer={<AppFooter />}
      padding={0}
    >
      <AppNavbar />
      <Outlet />
      <Affix position={{ bottom: 70, right: 15 }}>
        <ActionIcon
          variant="filled"
          color="blue"
          size={64}
          radius={64}
          onClick={openEditTootModal}
          sx={(theme) => ({ boxShadow: theme.shadows.sm })}
        >
          <IconPencil size={36} />
        </ActionIcon>
      </Affix>
    </AppShell>
  ) : (
    <LoadingOverlay visible />
  );
};
