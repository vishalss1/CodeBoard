import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoute from "../routes/auth.routes.js";
import refreshRoute from "../routes/refresh.routes.js";
import postRoute from "../routes/post.routes.js";

import errorHandler from "../middlewares/error.middleware.js";
import notFound from "../middlewares/notFound.middleware.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoute);
app.use("/refresh", refreshRoute);
app.use("/post", postRoute);

app.use(notFound);
app.use(errorHandler);

export default app;