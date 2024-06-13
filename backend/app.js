import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);

export { app };
