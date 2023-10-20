// Imports
import express from 'express';
import {getAllInteractions, getAllInteractionsOfAPost, createNewInteraction, updateInteraction, deleteInteraction} from '../controllers/interactionsController.js';
import { requireJsonContent, isParamANumber, isAvailableInteraction } from '../utils/middlewares.js';

// Router
const router = express.Router();

// GET

// (Disabilitata!)
// La route è a scopo dimostrativo, per il progetto le interazioni vengono mostrate solo nei post o tramite una GET inserendo come parametro l'ID del post di cui si vogliono vedere le interazioni
// togliere i commenti per abilitare la route
// router.get("/", getAllInteractions);

router.get("/:slug", isParamANumber, getAllInteractionsOfAPost);

// POST
router.post("/", requireJsonContent, isAvailableInteraction, createNewInteraction);

//PUT
router.put("/:slug", isParamANumber, requireJsonContent, isAvailableInteraction, updateInteraction);

//DELETE
router.delete("/:slug", isParamANumber, requireJsonContent, deleteInteraction);

//Export
export {router as interactionsRouter}