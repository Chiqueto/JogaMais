import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { tournamentController } from "../controllers/tournamentController";

const tournamentRoutes = Router();

tournamentRoutes.post("/", authMiddleware, tournamentController.createTournament);

export { tournamentRoutes };