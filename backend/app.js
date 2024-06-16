import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import artistRoutes from "./routes/artist.routes.js";
import musicRoutes from "./routes/music.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/music", musicRoutes);

export { app };
