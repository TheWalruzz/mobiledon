import React, { useCallback, useEffect, useState } from "react";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./contexts/AppContext";
import { ModalsProvider } from "@mantine/modals";
import { CustomModalProvider } from "./contexts/CustomModalContext";
import { EditTootModal } from "./components/modals/EditTootModal";
import { ImageDetailsModal } from "./components/modals/ImageDetailsModal";

export const App = () => {
  // TODO: extract this to context dependent on user's preferences
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] =
    useState<ColorScheme>(preferredColorScheme);
  const toggleColorScheme = useCallback(
    (value?: ColorScheme) =>
      setColorScheme(value || (colorScheme === "dark" ? "light" : "dark")),
    [colorScheme],
  );

  useEffect(() => {
    setColorScheme(preferredColorScheme);
  }, [preferredColorScheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <AppContextProvider>
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
        </AppContextProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};
