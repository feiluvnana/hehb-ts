import "reflect-metadata";

import express, { json, NextFunction, Request, Response, urlencoded } from "express";
import fs from "fs";
import path from "path";
import { ApiError, InternalServerError, NotFoundError } from "./core/errors";

async function main() {
  const setupDir = fs.readdirSync(path.join(__dirname, "setup"));
  for (const f of setupDir) {
    await (await import(`./setup/${f}`)).initialize();
  }

  const app = express();
  app.use(urlencoded());
  app.use(json());
  const controllerDir = fs.readdirSync(path.join(__dirname, "controllers"));
  for (const f of controllerDir) {
    app.use(await import(`./controllers/${f}`).then((i) => i.router));
  }
  app.use((_, __, next) => {
    next(
      new NotFoundError("There is no hand for me to hold,\nno paving stone to take me home,\nI'm due for a miracle."),
    );
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      res.status(err.code).json(err);
    } else {
      res.status(500).json(new InternalServerError(err.toString()));
    }
  });
  app.listen(3000, () => console.log("Server is running in port 3000..."));
}

void main();
