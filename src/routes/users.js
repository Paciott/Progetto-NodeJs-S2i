// Imports
import express from 'express';
import { getAllUsers, getUserById, createNewUser, updateUser, deleteUser } from '../controllers/usersController.js';
import { requireJsonContent, isParamANumber } from '../utils/middlewares.js';

// Router
const router = express.Router();

// GET
router.get("/", getAllUsers);
router.get("/:slug", isParamANumber, getUserById);

// POST
router.post("/", requireJsonContent, createNewUser);

//PUT
router.put("/:slug", isParamANumber, requireJsonContent, updateUser);

//DELETE
router.delete("/:slug", isParamANumber, deleteUser);

//Export
export {router as usersRouter}