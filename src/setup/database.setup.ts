import { DataSource } from "typeorm";

export let DatabaseSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  synchronize: true,
  logging: true,
  entities: ["**/*.model.ts"],
  database: "hehb-ts",
});

export async function initialize() {
  try {
    await DatabaseSource.initialize().then((source) => (DatabaseSource = source));
  } catch (e) {
    console.log("[database] Initialization failed: " + e);
  }
}
