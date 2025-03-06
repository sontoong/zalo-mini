import React from "react";
import { Box, Page } from "zmp-ui";
import { Welcome } from "./header";
import { ZaloInfo } from "./zalo-info";

const HomePage: React.FunctionComponent = () => {
  return (
    <Page className="relative flex flex-1 flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto">
        <ZaloInfo />
      </Box>
    </Page>
  );
};

export default HomePage;
