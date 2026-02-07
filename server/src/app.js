import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "../routes/auth.routes.js";
import refreshRouter from "../routes/refresh.routes.js";

import authVerify from "../middlewares/auth.middleware.js";
import errorHandler from "../middlewares/error.middleware.js";
import notFound from "../middlewares/notFound.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());


export default app;