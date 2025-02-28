import { tags } from "typia";
import { TagType } from "../core/types";
import { Tag } from "../entities/tag.entity";
import { Database } from "../setup/database.setup";

export interface CreateTagDto {
  name: string & tags.MinLength<1>;
  description: string & tags.MinLength<1>;
  type: TagType;
  fragment: string & tags.MinLength<1>;
}

export type BulkCreateTagDto = CreateTagDto[] & tags.MinItems<1>;

export const TagService = Database.getRepository(Tag).extend({
  async bulkCreate(dto: BulkCreateTagDto): Promise<Tag[]> {
    return this.save(dto);
  },
});
