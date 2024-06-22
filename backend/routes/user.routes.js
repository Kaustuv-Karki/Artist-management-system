import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  logoutUser,
  refreshToken,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshToken);

export default router;
