import React, { FC } from "react";
import { Box, Header, Text } from "zmp-ui";
import appConfig from "../../../../app-config.json";
import logo from "../../static/logo.svg";
import { getConfig } from "../../utils/config";

export const Welcome: FC = () => {
  return (
    <Header
      className="app-header no-border flex-none pb-[6px] pl-4"
      showBackIcon={false}
      title={
        (
          <Box flex alignItems="center" className="space-x-2">
            <img
              className="border-inset h-8 w-8 rounded-lg"
              src={getConfig((c) => c.template.headerLogo) || logo}
            />
            <Box>
              <Text.Title size="small">{appConfig.app.title}</Text.Title>
            </Box>
          </Box>
        ) as unknown as string
      }
    />
  );
};
