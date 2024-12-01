import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import assetRoutes from "./routes/assets.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", assetRoutes);
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

export default app;
