import express from "express";
import cors from "cors";
import {userRoutes} from "./routes/userRoutes";
import {tournamentRoutes} from "./routes/tournamentRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Rotas
app.use("/user", userRoutes);
app.use("/tournament", tournamentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

export default app;