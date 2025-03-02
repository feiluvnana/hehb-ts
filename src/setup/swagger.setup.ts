import { OpenApiGeneratorV31, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { globSync, writeFileSync } from "fs";

export const SwaggerRegistry = new OpenAPIRegistry();

export async function initialize() {
  const dirs = globSync("**/*.controller.ts");
  for (const f of dirs) {
    await import(f.replace("src", ".."));
  }
  const document = new OpenApiGeneratorV31(SwaggerRegistry.definitions).generateDocument({
    openapi: "3.1.0",
    info: {
      title: "HappyEduHub API",
      version: "1.0.0",
      description: "API của HappyEduHub"
    },
    tags: [
      {
        name: "Auth",
        description: "Các API liên quan đến xác thực."
      },
      {
        name: "Tags",
        description: "Các API liên quan đến tag."
      },
      {
        name: "Users",
        description: "Các API liên quan đến người dùng."
      }
    ].sort((a, b) => a.name.localeCompare(b.name))
  });
  if (document.components !== undefined) {
    document.components.securitySchemes = {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    };
    document.components.schemas = Object.keys(document.components?.schemas ?? {})
      .sort()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .reduce((obj: any, key) => {
        obj[key] = document.components?.schemas?.[key];
        return obj;
      }, {});
  }
  writeFileSync("swagger.json", JSON.stringify(document));
}
