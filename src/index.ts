import "reflect-metadata";

import fs from "fs";
import express from "express";

async function main() {
  const setupDir = fs.readdirSync("src/setup");
  for (const f of setupDir) {
    await (await import(`./setup/${f}`)).initialize();
  }

  const app = express();
  app.listen(3000, () => console.log("Server is running in port 3000..."));
}

void main();
