import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

console.log("✅ Step 1: Modules imported successfully");

import doctorRoutes from "./routes/doctors";
import specialtyRoutes from "./routes/specialties";
import appointment from "./routes/appointments";


dotenv.config();
console.log("✅ Step 2: dotenv configured");

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
console.log("✅ Step 3: Middlewares loaded");


app.use("/appointments", appointment);
app.use("/doctors", doctorRoutes);
app.use("/specialties", specialtyRoutes);
console.log("✅ Step 4: Routes registered");

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server running fine 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Step 5: Server started on port ${PORT}`);
});
