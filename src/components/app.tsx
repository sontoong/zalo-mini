import React from "react";
import { Route, Routes } from "react-router-dom";
import { getSystemInfo } from "zmp-sdk";
import { App, Box, SnackbarProvider, ZMPRouter } from "zmp-ui";
import HomePage from "../pages/index/index";
import LoginPage from "../pages/login/index";
import { getConfig } from "../utils/config";
import { ConfigProvider } from "./config-provider";
import { ScrollRestoration } from "./scroll-restoration";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../redux/store";
import { Provider } from "react-redux";
import { Navigation } from "./navigation";

if (import.meta.env.DEV) {
  document.body.style.setProperty("--zaui-safe-area-inset-top", "24px");
} else if (getSystemInfo().platform === "android") {
  const statusBarHeight =
    window.ZaloJavaScriptInterface?.getStatusBarHeight() ?? 0;
  const androidSafeTop = Math.round(statusBarHeight / window.devicePixelRatio);
  document.body.style.setProperty(
    "--zaui-safe-area-inset-top",
    `${androidSafeTop}px`,
  );
}

const MyApp = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          cssVariables={{
            "--zmp-primary-color": getConfig((c) => c.template.primaryColor),
            "--zmp-background-color": "#f4f5f6",
          }}
        >
          <App>
            <SnackbarProvider>
              <ZMPRouter>
                <Box flex flexDirection="column" className="h-screen">
                  <ScrollRestoration />
                  <Box className="flex flex-1 flex-col overflow-hidden">
                    <Routes>
                      <Route path="/" element={<HomePage />}></Route>
                      <Route path="/login" element={<LoginPage />}></Route>
                    </Routes>
                  </Box>
                  <Navigation />
                </Box>
              </ZMPRouter>
            </SnackbarProvider>
          </App>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
};
export default MyApp;
