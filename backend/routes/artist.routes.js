import express from "express";
import {
  createArtist,
  deleteArtistById,
  getArtistById,
  getArtists,
  importArtist,
  updateArtistById,
  uploadArtists,
} from "../controllers/artist.controller.js";
import multer from "multer";
import { verifyJwt } from "../middleware/verifyJwt.js";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", createArtist);
router.get("/download", importArtist);
router.get("/", getArtists);
router.get("/:id", getArtistById);
router.put("/update/:id", verifyJwt, updateArtistById);
router.delete("/:id", deleteArtistById);
router.post("/upload", upload.single("file"), uploadArtists);

export default router;
