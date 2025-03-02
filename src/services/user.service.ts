import { z } from "zod";
import { User, UserEntity } from "../entities/user.entity";
import { Database } from "../setup/database.setup";

export const UserService = Database.getRepository(UserEntity).extend({
  async readOneById(id: string): Promise<z.infer<typeof User> | null> {
    return this.findOneBy({ id }).then((user) => (user ? User.parse(user) : null));
  }
});
