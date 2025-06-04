import { User } from "../entities/User";

export interface IUserRepository {
  getUser(id: string): Promise<User>;
  login(username: string, password: string): Promise<User>;
}
