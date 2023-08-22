import dotenv from "dotenv";
import db from "./config/database";

dotenv.config({ path: "./config.env" }); // has to be set before requiring app because the env vars have to be set so the app module has access to it also

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const port: string | undefined = process.env.PORT;

console.log(`listening on port ${port}`);
