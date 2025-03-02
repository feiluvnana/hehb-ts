import { NextFunction, Request, Response, Router } from "express";
import { z } from "zod";
import { UnprocessableEntityError } from "../core/errors";
import { AuthService, LoginDto, RegisterDto } from "../services/auth.service";
import { Database } from "../setup/database.setup";
import { SwaggerRegistry } from "../setup/swagger.setup";

export const router = Router();

SwaggerRegistry.registerPath({
  tags: ["Auth"],
  path: "/auth/register",
  method: "post",
  summary: "Register a new user",
  request: { body: { content: { "application/json": { schema: RegisterDto } } } },
  responses: {
    "200": { description: "", content: { "application/json": { schema: z.object({ message: z.string() }) } } }
  }
});
router.post("/auth/register", async (req: Request, res: Response, next: NextFunction) => {
  const validation = RegisterDto.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntityError(validation.error.message));
  }

  try {
    await Database.transaction(async (manager) => {
      const authService = manager.withRepository(AuthService);
      return authService.register(validation.data);
    });
    res.status(200).json({ message: "Đăng ký tài khoản thành công." });
  } catch (e) {
    return next(e);
  }
});

SwaggerRegistry.registerPath({
  tags: ["Auth"],
  path: "/auth/login",
  method: "post",
  summary: "Login to the system",
  request: { body: { content: { "application/json": { schema: LoginDto } } } },
  responses: {
    "200": { description: "", content: { "application/json": { schema: z.object({ message: z.string() }) } } }
  }
});
router.post("/auth/login", async (req: Request, res: Response, next: NextFunction) => {
  const validation = LoginDto.safeParse(req.body);
  if (!validation.success) {
    return next(new UnprocessableEntityError(validation.error.message));
  }

  try {
    const data = await Database.transaction(async (manager) => {
      const authService = manager.withRepository(AuthService);
      return await authService.login(validation.data);
    });
    res.status(200).json(data);
  } catch (e) {
    return next(e);
  }
});
