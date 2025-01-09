import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { tournamentController } from "../controllers/tournamentController";

const tournamentRoutes = Router();

tournamentRoutes.post("/", authMiddleware, tournamentController.createTournament);
tournamentRoutes.post("/finish/:id", authMiddleware, tournamentController.finishTournament);
tournamentRoutes.get("/", authMiddleware, tournamentController.getAllTournaments);
tournamentRoutes.get("/:id", authMiddleware, tournamentController.getTournamentById);
tournamentRoutes.get("/owner/:id", authMiddleware, tournamentController.getTournamentsByUser);
tournamentRoutes.put("/:id", authMiddleware, tournamentController.updateTournament);


export { tournamentRoutes };