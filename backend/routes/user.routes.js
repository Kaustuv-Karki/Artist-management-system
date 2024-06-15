import express from "express";
import {
  createUser,
  loginUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.put("/update", updateUser);

export default router;
