import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { UserRole } from "../entities/user.entity";
import { UnauthorizedError } from "./errors";

export const extractToken = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const tokenFragments = req.headers.authorization?.trim().split(" ");
    if (!tokenFragments || tokenFragments.length !== 2 || tokenFragments[0] !== "Bearer") {
      return next(new UnauthorizedError("Thiếu token hoặc định dạng không hợp lệ."));
    }
    const token = tokenFragments[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
      res.locals.user = payload;
      console.log(payload);
    } catch {
      return next(new UnauthorizedError("Token không hợp lệ."));
    }
    next();
  };
};

export const allowRoles = (...roles: z.infer<typeof UserRole>[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    if (!roles.includes(user.role)) {
      return next(new UnauthorizedError("Bạn không có quyền truy cập."));
    }
    next();
  };
};
