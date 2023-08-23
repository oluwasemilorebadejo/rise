import { Sequelize } from "sequelize";

const db = new Sequelize(
  "postgres://risevestdb_user:1ItPF2a4ZcueDkfguj1aCGHfLvVXmVwf@dpg-cjij51ocfp5c738hovc0-a.oregon-postgres.render.com/risevestdb?ssl=true"
);

export default db;
