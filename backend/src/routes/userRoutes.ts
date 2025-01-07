import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {userController} from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/",  userController.createUser);

export  {userRoutes} ;