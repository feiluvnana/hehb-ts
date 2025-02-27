import { Router } from "express";
import typia, { IValidation } from "typia";
import { ValidationError } from "../core/errors";
import { BulkCreateTagDto } from "../services/tag.service";

const r = Router();
r.post("/tags", (req, res, next) => {
  const validation: IValidation<BulkCreateTagDto> = typia.validate<BulkCreateTagDto>(req.body);
  if (!validation.success) {
    return next(
      new ValidationError(
        validation.errors.map((e) => `At ${e.path}: ${e.expected} expected but ${e.value} found.`).join("\n"),
      ),
    );
  }

  res.status(200).json({ message: "Oka" });
});

export const router = r;
