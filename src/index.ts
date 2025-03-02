import "reflect-metadata";

import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import dotenv from "dotenv";
import express, { json, NextFunction, Request, Response, urlencoded } from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { z } from "zod";
import { ApiError, InternalServerError } from "./core/errors";

dotenv.config();
extendZodWithOpenApi(z);

async function main() {
  const setupDir = fs.readdirSync(path.join(__dirname, "setup"));
  for (const f of setupDir) {
    await (await import(`./setup/${f}`)).initialize();
  }

  const app = express();
  app.use(urlencoded());
  app.use(json());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(JSON.parse(fs.readFileSync("swagger.json", "utf-8"))));

  const controllerDir = fs.readdirSync(path.join(__dirname, "controllers"));
  for (const f of controllerDir) {
    app.use(await import(`./controllers/${f}`).then((i) => i.router));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((_, res, __) => {
    res.redirect("/api-docs");
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err instanceof ApiError) {
      res.status(err.code).json(err);
    } else {
      res.status(500).json(new InternalServerError(JSON.stringify(err)));
    }
  });
  app.listen(3000, () => console.log("Server is running in port 3000..."));
}

void main();
