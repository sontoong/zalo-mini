import { User } from "../../core/entities/User";
import { IUserRepository } from "../../core/repositories/IUserRepository";
import { createUserRemoteDataSource } from "../datasources/UserRemoteDataSource";

export const createUserRepository = (): IUserRepository => {
  const userRemoteDataSource = createUserRemoteDataSource();

  return {
    getUser: async (id: string): Promise<User> => {
      return userRemoteDataSource.fetchUser(id);
    },
    login: async (username: string, password: string): Promise<User> => {
      return userRemoteDataSource.login(username, password);
    },
  };
};
