import express from "express";
import cors from "cors";
import {userRoutes} from "./routes/userRoutes";
import {tournamentRoutes} from "./routes/tournamentRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Rotas
app.use("/users", userRoutes);
app.use("/tournaments", tournamentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  // console.log(`Server running on port ${PORT}`);
});

export default app;