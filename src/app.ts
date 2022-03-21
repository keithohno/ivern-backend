import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import "./util/passport";
import protRouter from "./routes/protected";
import pubRouter from "./routes";

const app = express();

app.use(express.json());
app.use(session({ resave: true, saveUninitialized: true, secret: "jaesul" }));

app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

app.use(pubRouter);
app.use("/p", protRouter);

export default app;
