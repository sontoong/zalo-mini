import { User } from "../../core/entities/User";
import { IUserRepository } from "../../core/repositories/IUserRepository";

export class UserLocalDataSource implements IUserRepository {
  private users: User[] = [
    { id: "1", username: "admin", password: "password" },
    { id: "2", username: "user", password: "password123" },
  ];

  async getUser(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (user) {
      return user;
    } else {
      throw new Error("User not found");
    }
  }

  async login(username: string, password: string): Promise<User> {
    const user = this.users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      return user;
    } else {
      throw new Error("Invalid username or password");
    }
  }
}
