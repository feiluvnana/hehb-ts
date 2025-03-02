import { Router } from "express";
import { NotFoundEntityError } from "../core/errors";
import { extractToken } from "../core/middlewares";
import { User } from "../entities/user.entity";
import { UserService } from "../services/user.service";
import { SwaggerRegistry } from "../setup/swagger.setup";

export const router = Router();

SwaggerRegistry.registerPath({
  tags: ["Users"],
  path: "/users/profile",
  method: "get",
  summary: "Get user profile",
  security: [{ bearerAuth: [] }],
  responses: {
    "200": { description: "", content: { "application/json": { schema: User } } }
  }
});
router.get("/users/profile", extractToken, async (req, res, next) => {
  const user = await UserService.readOneById(res.locals.user.id);
  if (!user) {
    return next(new NotFoundEntityError({ name: "User", ids: [res.locals.user.id] }));
  }
  res.status(200).json(user);
});
