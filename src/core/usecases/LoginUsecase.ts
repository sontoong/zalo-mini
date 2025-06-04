import { IUserRepository } from "../repositories/IUserRepository";

export const createLoginUseCase = (userRepository: IUserRepository) => {
  return {
    execute: async (username: string, password: string) => {
      return userRepository.login(username, password);
    },
  };
};
