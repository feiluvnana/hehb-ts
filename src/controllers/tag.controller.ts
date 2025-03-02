import { Router } from "express";
import { z } from "zod";
import { UnprocessableEntityError } from "../core/errors";
import { allowRoles, extractToken } from "../core/middlewares";
import { TagArray } from "../entities/tag.entity";
import { UserRole } from "../entities/user.entity";
import { BulkCreateTagDto, BulkDeleteTagDto, BulkUpdateTagDto, TagService } from "../services/tag.service";
import { Database } from "../setup/database.setup";
import { SwaggerRegistry } from "../setup/swagger.setup";

export const router = Router();

SwaggerRegistry.registerPath({
  tags: ["Tags"],
  path: "/tags",
  method: "get",
  summary: "Lấy tất cả các tag.",
  responses: {
    "200": { description: "", content: { "application/json": { schema: TagArray } } }
  }
});
router.get("/tags", async (req, res, next) => {
  try {
    const tags = await Database.transaction(async (manager) => {
      const tagService = manager.withRepository(TagService);
      return tagService.readAll();
    });
    res.status(200).json(tags);
  } catch (e) {
    return next(e);
  }
});

SwaggerRegistry.registerPath({
  tags: ["Tags"],
  path: "/tags",
  method: "post",
  summary: "Tạo tag mới.",
  request: { body: { content: { "application/json": { schema: BulkCreateTagDto } } } },
  responses: {
    "200": { description: "", content: { "application/json": { schema: TagArray } } }
  }
});
router.post("/tags", extractToken(), allowRoles(UserRole.Values.ADMIN), async (req, res, next) => {
  const validation = BulkCreateTagDto.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntityError(validation.error.message));
  }

  try {
    const tags = await Database.transaction(async (manager) => {
      const tagService = manager.withRepository(TagService);
      return tagService.bulkCreate(validation.data);
    });
    res.status(200).json(tags);
  } catch (e) {
    return next(e);
  }
});

SwaggerRegistry.registerPath({
  tags: ["Tags"],
  path: "/tags",
  method: "put",
  summary: "Cập nhật tag.",
  request: { body: { content: { "application/json": { schema: BulkUpdateTagDto } } } },
  responses: {
    "200": { description: "", content: { "application/json": { schema: TagArray } } }
  }
});
router.put("/tags", async (req, res, next) => {
  const validation = BulkUpdateTagDto.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntityError(validation.error.message));
  }

  try {
    const tags = await Database.transaction(async (manager) => {
      const tagService = manager.withRepository(TagService);
      return tagService.bulkUpdate(validation.data);
    });
    res.status(200).json(tags);
  } catch (e) {
    return next(e);
  }
});

SwaggerRegistry.registerPath({
  tags: ["Tags"],
  path: "/tags",
  method: "delete",
  summary: "Xóa tag.",
  request: { body: { content: { "application/json": { schema: BulkDeleteTagDto } } } },
  responses: {
    "200": { description: "", content: { "application/json": { schema: z.object({ message: z.string() }) } } }
  }
});
router.delete("/tags", async (req, res, next) => {
  const validation = BulkDeleteTagDto.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntityError(validation.error.message));
  }

  try {
    await Database.transaction(async (manager) => {
      const tagService = manager.withRepository(TagService);
      return tagService.bulkDelete(validation.data);
    });
    res.status(200).json({ message: "Tags deleted successfully" });
  } catch (e) {
    return next(e);
  }
});
