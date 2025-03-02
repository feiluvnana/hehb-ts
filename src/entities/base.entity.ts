import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";

export class BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;

  @DeleteDateColumn()
  declare deleted_at?: Date;

  @VersionColumn()
  declare version: number;
}
