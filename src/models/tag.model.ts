import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "tags" })
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column({ nullable: false })
  declare name: string;

  @Column({ nullable: false })
  declare description: string;

  @Column({ nullable: false })
  declare fragment: string;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;
}
