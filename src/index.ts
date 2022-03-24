import "dotenv/config";
import { connect } from "mongoose";

import App from "./app";

const main = async () => {
  await connect(process.env.MONGO_URI);

  App(process.env.ORIGINS.split(" ")).listen(5000, () => {
    console.log(`server started at port 5000`);
  });
};

main().catch((e) => {
  console.log(e);
});
