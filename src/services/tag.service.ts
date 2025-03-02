import { In } from "typeorm";
import { z } from "zod";
import { NotFoundEntityError } from "../core/errors";
import { Tag, TagEntity, TagType } from "../entities/tag.entity";
import { Database } from "../setup/database.setup";

export const CreateTagDto = z
  .object({
    name: z.string().min(1),
    description: z.string().min(1),
    type: TagType,
    fragment: z.string().min(1)
  })
  .openapi("CreateTagDto");

export const BulkCreateTagDto = z.array(CreateTagDto).min(1).openapi("BulkCreateTagDto");

export const UpdateTagDto = z
  .object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: TagType.optional(),
    fragment: z.string().min(1).optional()
  })
  .openapi("UpdateTagDto");

export const BulkUpdateTagDto = z.array(UpdateTagDto).min(1).openapi("BulkUpdateTagDto");

export const BulkDeleteTagDto = z.array(z.string().uuid()).min(1).openapi("BulkDeleteTagDto");

export const TagService = Database.getRepository(TagEntity).extend({
  async readAll(): Promise<z.infer<typeof Tag>[]> {
    return this.find().then((tags) => tags.map((tag) => Tag.parse(tag)));
  },

  async bulkCreate(dto: z.infer<typeof BulkCreateTagDto>): Promise<z.infer<typeof Tag>[]> {
    const tags = await this.save(dto);
    console.log(tags);
    return tags.map((tag) => Tag.parse(tag));
  },

  async bulkUpdate(dto: z.infer<typeof BulkUpdateTagDto>): Promise<z.infer<typeof Tag>[]> {
    const ids = dto.map((d) => d.id);
    const tags = await this.find({ where: { id: In(ids) } });
    if (tags.length < dto.length) {
      throw new NotFoundEntityError({
        name: "Tag",
        ids: ids.filter((id) => tags.findIndex((tag) => tag.id != id) == -1)
      });
    }

    return this.save(dto).then((tags) => tags.map((tag) => Tag.parse(tag)));
  },

  async bulkDelete(dto: z.infer<typeof BulkDeleteTagDto>): Promise<void> {
    const tags = await this.find({ where: { id: In(dto) } });
    if (tags.length < dto.length) {
      throw new NotFoundEntityError({
        name: "Tag",
        ids: dto.filter((id) => tags.findIndex((tag) => tag.id != id) == -1)
      });
    }

    await this.delete({ id: In(dto) });
  }
});
