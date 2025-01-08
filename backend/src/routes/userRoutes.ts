import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {userController} from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/",  userController.createUser);
userRoutes.get("/", authMiddleware, userController.getAllUsers);
userRoutes.get("/:id", authMiddleware, userController.getUserById);
userRoutes.put("/:id", authMiddleware, userController.updateUser);

//Login
userRoutes.post("/login", userController.login);

export  {userRoutes} ;