import express from "express";
import {
  createArtist,
  deleteArtistById,
  getArtistById,
  getArtists,
  updateArtistById,
} from "../controllers/artist.controller.js";

const router = express.Router();

router.post("/", createArtist);
router.get("/", getArtists);
router.get("/:id", getArtistById);
router.put("/update/:id", updateArtistById);
router.delete("/delete/:id", deleteArtistById);

export default router;
