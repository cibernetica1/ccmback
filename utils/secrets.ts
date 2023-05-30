import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  console.log("no .env found");
}

export const APP_SECRET = <string>process.env.APP_SECRET;
export const APP_ID = <string>process.env.APP_ID;
export const TENANT = <string>process.env.TENANT;
export const HOST_URL = <string>process.env.HOST_URL;
export const SESSION_SECRET = <string>process.env.SESSION_SECRET;
export const PORT = <string>process.env.PORT;
export const URL_FRONTEND = <string>process.env.URL_FRONTEND;
