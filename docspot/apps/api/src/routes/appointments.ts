import { Router } from "express";
import prisma from "../utils/prisma";

const router = Router();

// ------------------------------------------------------------
// POST /appointments → create appointment
// ------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { userId, doctorId, clinicLocationId, startsAt, endsAt } = req.body;

    if (!userId || !doctorId || !clinicLocationId || !startsAt || !endsAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await prisma.appointment.findFirst({
      where: { doctorId, startsAt: new Date(startsAt) },
    });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Doctor already has an appointment at this time" });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        doctorId,
        clinicLocationId,
        startsAt: new Date(startsAt),
        endsAt: new Date(endsAt),
      },
      include: {
        doctor: { include: { specialty: true } },
        clinic: true,
      },
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("❌ Error creating appointment:", err);
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

// ------------------------------------------------------------
// GET /appointments → all appointments (optional ?status=confirmed)
// ------------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status: String(status) } : {};

    const appointments = await prisma.appointment.findMany({
      where: filter,
      include: {
        doctor: { include: { specialty: true } },
        clinic: true,
        user: true,
      },
      orderBy: { startsAt: "asc" },
    });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Error fetching appointments:", err);
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// ------------------------------------------------------------
// GET /appointments/:userId → user’s appointments
// ------------------------------------------------------------
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const appointments = await prisma.appointment.findMany({
      where: { userId },
      include: {
        doctor: { include: { specialty: true } },
        clinic: true,
      },
      orderBy: { startsAt: "asc" },
    });

    res.json(appointments);
  } catch (err) {
    console.error("❌ Error fetching user appointments:", err);
    res.status(500).json({ error: "Failed to fetch user appointments" });
  }
});

// ------------------------------------------------------------
// PATCH /appointments/:id/confirm
// ------------------------------------------------------------
router.patch("/:id/confirm", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "confirmed" },
    });
    res.json({ message: "Appointment confirmed", appointment: updated });
  } catch (err) {
    console.error("❌ Error confirming appointment:", err);
    res.status(500).json({ error: "Failed to confirm appointment" });
  }
});

// ------------------------------------------------------------
// PATCH /appointments/:id/cancel
// ------------------------------------------------------------
router.patch("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "cancelled" },
    });
    res.json({ message: "Appointment cancelled", appointment: updated });
  } catch (err) {
    console.error("❌ Error cancelling appointment:", err);
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

// ------------------------------------------------------------
// PATCH /appointments/:id/pay → mark as paid
// ------------------------------------------------------------
router.patch("/:id/pay", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "paid" },
    });
    res.json({ message: "Appointment marked as paid", appointment: updated });
  } catch (err) {
    console.error("❌ Error marking appointment as paid:", err);
    res.status(500).json({ error: "Failed to update payment status" });
  }
});

export default router;
