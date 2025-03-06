import { useUser } from "../../hooks/useUser";
import React from "react";
import { Button, Input } from "zmp-ui";

export const LoginForm = () => {
  const { state: userState, handleLogin, handleGetAccountInfo } = useUser();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const username = data.get("username") as string;
    const password = data.get("password") as string;
    handleLogin({
      body: { username, password },
      callBackFn: () => handleGetAccountInfo(),
    });
  };

  return (
    <form className="flex h-fit flex-col px-10" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 space-y-2 py-2">
        <Input name="username" label="Username" />
        <Input.Password name="password" label="Password" visibilityToggle />
      </div>
      <div className="bg-section p-6 pt-4">
        <Button htmlType="submit" fullWidth loading={userState?.isSending}>
          Xong
        </Button>
      </div>
    </form>
  );
};
