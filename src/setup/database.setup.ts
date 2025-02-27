import { DataSource } from "typeorm";

export let Database = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  synchronize: true,
  logging: true,
  entities: ["**/*.entity.ts"],
  database: "hehb-ts",
});

export async function initialize() {
  try {
    await Database.initialize().then((source) => (Database = source));
  } catch (e) {
    console.log("Initialization failed: " + e);
  }
}
