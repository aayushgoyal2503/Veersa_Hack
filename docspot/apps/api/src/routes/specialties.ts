import { Router } from "express";
import prisma from "../utils/prisma";

const router = Router();

// GET /specialties - List all specialties
router.get("/", async (req, res) => {
  try {
    const specialties = await prisma.specialty.findMany({
      orderBy: { name: "asc" },
    });
    res.json(specialties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch specialties" });
  }
});

export default router;
