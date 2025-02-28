import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TagType } from "../core/types";

@Entity({ name: "tags" })
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column({ nullable: false, unique: true })
  declare name: string;

  @Column({ nullable: false })
  declare description: string;

  @Column({ nullable: false })
  declare type: TagType;

  @Column({ nullable: false, unique: true })
  declare fragment: string;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}
