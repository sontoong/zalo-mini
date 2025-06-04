import { User } from "../../core/entities/User";
import { UserModel } from "../models/UserModel";

export const createUserRemoteDataSource = () => ({
  fetchUser: async (id: string): Promise<User> => {
    // Simulate an API call
    // fake apu return
    return new UserModel(id, "John Doe", "password");
  },

  login: async (username: string, password: string): Promise<User> => {
    // Simulate an API call for login
    const users = [
      new UserModel("1", "admin", "password"),
      new UserModel("2", "user", "password123"),
    ];

    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (user) {
      return user;
    } else {
      throw new Error("Invalid username or password");
    }
  },
});
