import { User } from "../../core/entities/User";

export class UserModel implements User {
  constructor(
    public id: string,
    public username: string,
    public password: string
  ) {}
}
