import { Column, Entity } from "typeorm";
import { z } from "zod";
import { BaseEntity } from "./base.entity";

export const UserRole = z.enum(["ADMIN", "ACADEMIC_AFFAIR", "STUDENT", "TEACHER"]);

export const UserGender = z.enum(["MALE", "FEMALE"]);

export const User = z
  .object({
    id: z.string(),
    email: z.string(),
    role: UserRole,
    gender: UserGender,
    avatar: z.string().nullable().optional(),
    tel: z.string().nullable().optional(),
    dob: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    created_at: z.date(),
    updated_at: z.date(),
    version: z.number()
  })
  .openapi("User");

export const UserArray = z.array(User).openapi("UserArray");

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  declare email: string;

  @Column({ type: "varchar", nullable: false })
  declare password: string;

  @Column({ type: "enum", nullable: false, enum: UserRole.Values })
  declare role: string;

  @Column({ type: "enum", nullable: false, enum: UserGender.Values })
  declare gender: string;

  @Column({ type: "varchar", nullable: true })
  declare avatar?: string;

  @Column({ type: "varchar", nullable: true })
  declare tel?: string;

  @Column({ type: "date", nullable: true })
  declare dob?: Date;

  @Column({ type: "varchar", nullable: true })
  declare code?: string;

  @Column({ type: "varchar", nullable: true })
  declare address?: string;
}
