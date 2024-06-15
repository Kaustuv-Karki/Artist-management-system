import express from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

export default router;
