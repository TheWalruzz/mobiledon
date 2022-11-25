import React, { useCallback } from "react";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { ModalsProvider } from "@mantine/modals";
import { CustomModalProvider } from "./contexts/CustomModalContext";
import { EditTootModal } from "./components/modals/EditTootModal";
import { ImageDetailsModal } from "./components/modals/ImageDetailsModal";
import { NotificationsProvider } from "@mantine/notifications";
import { useAppContext } from "./contexts/AppContext";

export const App = () => {
  const { colorScheme, setColorScheme } = useAppContext();
  const toggleColorScheme = useCallback(
    (value?: ColorScheme) =>
      setColorScheme(value || (colorScheme === "dark" ? "light" : "dark")),
    [colorScheme, setColorScheme],
  );

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme!}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <NotificationsProvider position="bottom-left">
          <BrowserRouter>
            <ModalsProvider>
              <CustomModalProvider
                customModals={{
                  editToot: EditTootModal,
                  imageDetails: ImageDetailsModal,
                }}
              >
                <Router />
              </CustomModalProvider>
            </ModalsProvider>
          </BrowserRouter>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
