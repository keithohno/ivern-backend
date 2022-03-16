import App from "./app";
import { connect } from "mongoose";

const main = async () => {
  await connect(process.env.MONGO_URI);

  App.listen(5000, () => {
    console.log(`server started at port 5000`);
  });
};

main().catch((e) => {
  console.log(e);
});
