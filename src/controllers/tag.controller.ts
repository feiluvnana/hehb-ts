import { NextFunction, Request, Response, Router } from "express";
import typia, { IValidation } from "typia";
import { ValidationError } from "../core/errors";
import { BulkCreateTagDto, TagService } from "../services/tag.service";
import { Database } from "../setup/database.setup";

const r = Router();
r.post("/tags", async (req: Request, res: Response, next: NextFunction) => {
  const validation: IValidation<BulkCreateTagDto> = typia.validate<BulkCreateTagDto>(req.body);
  if (!validation.success) {
    return next(
      new ValidationError(
        validation.errors.map((e) => `At ${e.path}: ${e.expected} expected but ${e.value} found.`).join("\n"),
      ),
    );
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

export const router = r;
