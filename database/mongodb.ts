import mongoose, { ConnectOptions } from "mongoose";
import { DB } from "../utils/secrets";

mongoose.connect(DB.URI, {
  user: DB.USER,
  pass: DB.PASSWORD,
} as ConnectOptions);

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Mongodb Connection stablished");
});

connection.on("error", (err) => {
  console.log("Mongodb connection error:", err);
  process.exit();
});
