import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { BadRequestError, UnauthorizedError } from "../core/errors";
import { User, UserEntity, UserGender, UserRole } from "../entities/user.entity";
import { Database } from "../setup/database.setup";

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  gender: UserGender,
  avatar: z.string().optional(),
  tel: z.string().optional(),
  dob: z.string().optional(),
  code: z.string().optional(),
  address: z.string().optional()
});

export type RegisterDto = z.infer<typeof RegisterDto>;

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export type LoginDto = z.infer<typeof LoginDto>;

export const AuthService = Database.getRepository(UserEntity).extend({
  async register(dto: RegisterDto): Promise<z.infer<typeof User>> {
    const isEmailExists = await this.findOne({ where: { email: dto.email } }).then((user) => user !== null);
    if (isEmailExists) {
      throw new BadRequestError("This email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(dto.password, Number.parseInt(process.env.BCRYPT_SALT_ROUNDS!));
    return this.save(
      {
        ...dto,
        password: hashedPassword,
        role: UserRole.Values.STUDENT
      },
      { reload: true }
    ).then((user) => User.parse(user));
  },

  async login(dto: LoginDto): Promise<{
    user: z.infer<typeof User>;
    token: {
      access_token?: string;
      refresh_token?: string;
    };
  }> {
    const user = await this.findOne({ where: { email: dto.email } });
    if (!(await bcrypt.compare(dto.password, user?.password ?? "")) || user === null) {
      throw new UnauthorizedError("The email or password is incorrect.");
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: Number.parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME!)
    });
    return { user: User.parse(user), token: { access_token: accessToken } };
  }
});
