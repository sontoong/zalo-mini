import { User } from "../../models/user";
import React, { FC } from "react";

export const UserInfo: FC<{ user?: User }> = ({ user }) => {
  return (
    <div className="flex flex-col gap-3 px-10">
      <img src={user?.image} className="size-40" />
      <div>
        {user?.firstName} {user?.lastName}
      </div>
      <div>{user?.email}</div>
    </div>
  );
};
