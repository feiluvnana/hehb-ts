import { Repository } from "typeorm";
import { tags } from "typia";
import { Tag } from "../entities/tag.entity";

export interface CreateTagDto {
  name: string & tags.MinLength<1>;
  description: string & tags.MinLength<1>;
  fragment: string & tags.MinLength<1>;
}

export type BulkCreateTagDto = CreateTagDto[] & tags.MinItems<1>;

export class TagService extends Repository<Tag> {
  async bulkCreate(dto: BulkCreateTagDto): Promise<Tag[]> {
    return this.save(dto);
  }
}
