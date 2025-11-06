import { Router } from "express";
import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

console.log("✅ doctors route file loaded");

const router = Router();

// ------------------------------------------------------------
// GET /doctors  → list all doctors (optionally filter by specialty)
// ------------------------------------------------------------
router.get("/", async (req, res) => {
  console.log("🚀 Inside /doctors route handler");
  try {
    const { specialty } = req.query;

    const filter: Prisma.DoctorWhereInput = specialty
      ? {
          specialty: {
            is: {
              name: {
                equals: String(specialty),
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        }
      : {};

    const doctors = await prisma.doctor.findMany({
      where: filter,
      include: {
        specialty: true,
        clinics: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(doctors);
  } catch (err) {
    console.error("❌ Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// ------------------------------------------------------------
// GET /doctors/:id  → detailed doctor information
// ------------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        specialty: true,
        clinics: true,
        schedules: true,
      },
    });

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("❌ Error fetching doctor details:", err);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
});

export default router;
