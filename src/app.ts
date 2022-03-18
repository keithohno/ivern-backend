import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import "./util/passport";
import accountRouter from "./routes/account";
import userRouter from "./routes/user";

const app = express();

app.use(express.json());
app.use(session({ resave: true, saveUninitialized: true, secret: "jaesul" }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(accountRouter);
app.use("/user", userRouter);

export default app;
