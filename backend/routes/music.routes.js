import express from "express";
import {
  createMusic,
  deleteMusicById,
  getMusic,
  getMusicByArtistId,
  getMusicById,
  updateMusicById,
} from "../controllers/music.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";

const router = express.Router();

router.get("/", getMusic);
router.get("/:id", verifyJwt, getMusicById);
router.get("/artist/:artistId", verifyJwt, getMusicByArtistId);
router.post("/", verifyJwt, createMusic);
router.delete("/:id", verifyJwt, deleteMusicById);
router.put("/:id", verifyJwt, updateMusicById);

export default router;
