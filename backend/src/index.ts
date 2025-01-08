import express from "express";
import cors from "cors";
import {userRoutes} from "./routes/userRoutes";
// import championshipRoutes from "./routes/championshipRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Rotas
app.use("/users", userRoutes);
// app.use("/championships", championshipRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

export default app;