import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // --- 1. Specialties ---
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
  ];

  for (const name of specialties) {
    await prisma.specialty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Inserted specialties");

  // --- 2. Doctors ---
  const allSpecialties = await prisma.specialty.findMany();
  const doctorsData = [
    {
      name: "Dr. Ananya Mehta",
      yearsExperience: 8,
      rating: 4.7,
      specialtyId: allSpecialties.find((s) => s.name === "Cardiology")!.id,
    },
    {
      name: "Dr. Rahul Sharma",
      yearsExperience: 10,
      rating: 4.8,
      specialtyId: allSpecialties.find((s) => s.name === "Dermatology")!.id,
    },
    {
      name: "Dr. Priya Nair",
      yearsExperience: 6,
      rating: 4.6,
      specialtyId: allSpecialties.find((s) => s.name === "Pediatrics")!.id,
    },
    {
      name: "Dr. Karan Singh",
      yearsExperience: 12,
      rating: 4.9,
      specialtyId: allSpecialties.find((s) => s.name === "Neurology")!.id,
    },
    {
      name: "Dr. Sneha Kapoor",
      yearsExperience: 9,
      rating: 4.5,
      specialtyId: allSpecialties.find((s) => s.name === "Orthopedics")!.id,
    },
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.upsert({
      where: { name: doc.name },
      update: {},
      create: doc,
    });
  }

  console.log("✅ Inserted doctors");

  // --- 3. Clinic Locations ---
  const allDoctors = await prisma.doctor.findMany();
  const clinics = [
    {
      doctorId: allDoctors[0].id,
      address: "AIIMS Road, New Delhi",
      lat: 28.5672,
      lng: 77.2100,
    },
    {
      doctorId: allDoctors[1].id,
      address: "Connaught Place, New Delhi",
      lat: 28.6304,
      lng: 77.2177,
    },
    {
      doctorId: allDoctors[2].id,
      address: "Sector 62, Noida",
      lat: 28.6200,
      lng: 77.3600,
    },
    {
      doctorId: allDoctors[3].id,
      address: "Cyber Hub, Gurugram",
      lat: 28.4931,
      lng: 77.0865,
    },
    {
      doctorId: allDoctors[4].id,
      address: "Rajouri Garden, New Delhi",
      lat: 28.6420,
      lng: 77.1112,
    },
  ];

  for (const clinic of clinics) {
    await prisma.clinicLocation.upsert({
      where: { id: clinic.doctorId }, // dummy unique
      update: {},
      create: clinic,
    });
  }

  console.log("✅ Inserted clinic locations");

  // --- 4. Schedules ---
  const schedules = allDoctors.map((doc) => ({
    doctorId: doc.id,
    weekday: 1,
    startTime: "09:00",
    endTime: "17:00",
    slotMinutes: 30,
  }));

  for (const sched of schedules) {
    await prisma.doctorSchedule.create({
      data: sched,
    });
  }

  console.log("✅ Added schedules");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
