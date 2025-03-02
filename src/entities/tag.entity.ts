import { Column, Entity } from "typeorm";
import { z } from "zod";
import { BaseEntity } from "./base.entity";

export const TagType = z.enum(["SUBJECT", "GRADE"]);

export const Tag = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: TagType,
    fragment: z.string(),
    created_at: z.date(),
    updated_at: z.date(),
    version: z.number()
  })
  .openapi("Tag");

export const TagArray = z.array(Tag).openapi("TagArray");

@Entity({ name: "tags" })
export class TagEntity extends BaseEntity {
  @Column({ type: "varchar", nullable: false, unique: true })
  declare name: string;

  @Column({ type: "varchar", nullable: false })
  declare description: string;

  @Column({ type: "enum", nullable: false, enum: TagType.Values })
  declare type: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  declare fragment: string;
}
