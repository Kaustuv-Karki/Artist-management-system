import express from "express";
import {
  createMusic,
  deleteMusicById,
  getMusic,
  getMusicByArtistId,
  getMusicById,
  updateMusicById,
} from "../controllers/music.controller.js";

const router = express.Router();

router.get("/", getMusic);
router.get("/:id", getMusicById);
router.get("/artist/:artistId", getMusicByArtistId);
router.post("/", createMusic);
router.delete("/:id", deleteMusicById);
router.put("/:id", updateMusicById);

export default router;
