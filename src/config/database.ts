import { Sequelize } from "sequelize";

const db = new Sequelize("risevest", "postgres", "5560", {
  host: "localhost",
  dialect: "postgres",
});

export default db;
