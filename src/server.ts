import dotenv from "dotenv";

dotenv.config({ path: "./config.env" }); // has to be set before requiring app because the env vars have to be set so the app module has access to it also

const port = process.env.PORT;

console.log(`listening on port ${port}`);
