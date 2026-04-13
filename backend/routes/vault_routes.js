import express from "express";
import { getEntries, createEntry, updateEntry, deleteEntry } from "../controllers/vaultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// all vault routes are protected — authMiddleware checks the JWT token first
router.get("/", authMiddleware, getEntries);
router.post("/", authMiddleware, createEntry);
router.put("/:id", authMiddleware, updateEntry);
router.delete("/:id", authMiddleware, deleteEntry);

export default router;
