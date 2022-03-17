import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import "./util/passport";

import accountRouter from "./routes/account";

const app = express();

app.use(express.json());
app.use(session({ resave: true, saveUninitialized: true, secret: "jaesul" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(accountRouter);

export default app;
