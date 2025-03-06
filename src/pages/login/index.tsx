import React from "react";
import { Box, Page } from "zmp-ui";
import { Welcome } from "./header";
import { LoginForm } from "./login-form";
import { UserInfo } from "./user-info";
import { useUser } from "../../hooks/useUser";

const LoginPage: React.FunctionComponent = () => {
  const { state: userState } = useUser();

  return (
    <Page className="relative flex flex-1 flex-col bg-white">
      <Welcome />
      <Box className="flex-1 overflow-auto">
        <LoginForm />
        {Object.values(userState?.currentUser || {}).length ? (
          <UserInfo user={userState?.currentUser} />
        ) : (
          <></>
        )}
      </Box>
    </Page>
  );
};

export default LoginPage;
