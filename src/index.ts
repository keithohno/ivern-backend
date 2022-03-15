import "dotenv/config";
import express from "express";
import { connect } from "mongoose";

const app = express();

const main = async () => {
  await connect(process.env.MONGO_URI);

  app.get("/", async (req, res) => {
    res.send("Hello world!");
  });

  app.listen(5000, () => {
    console.log(`server started at port 5000`);
  });
};

main().catch((e) => {
  console.log(e);
});
