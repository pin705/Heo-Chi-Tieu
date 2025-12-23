import React, { Suspense } from "react";
import { App, ZMPRouter, SnackbarProvider, Box, Text } from "zmp-ui";
import { RecoilRoot } from "recoil";
import { getConfig } from "utils/config";
import { Layout } from "./layout";
import { ConfigProvider } from "./config-provider";

const MyApp = () => {
  return (
    <RecoilRoot>
      <ConfigProvider
        cssVariables={{
        }}
      >
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <Suspense fallback={
                <Box className="h-screen flex items-center justify-center bg-yellow-400">
                  <Text className="font-bold text-lg">Đang tải...</Text>
                </Box>
              }>
                <Layout />
              </Suspense>
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </ConfigProvider>
    </RecoilRoot>
  );
};
export default MyApp;
