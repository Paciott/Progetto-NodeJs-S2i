// Imports
import express from 'express';
import {getAllPosts, getPostById, createNewPost, updatePost, deletePost} from '../controllers/postsController.js';
import { requireJsonContent, isParamANumber, IsQueryParametersDateValid, IsQueryParametersAuthorIdValid, IsQueryParametersCityValid} from '../utils/middlewares.js';

// Router
const router = express.Router();

// GET
router.get("/", IsQueryParametersDateValid, IsQueryParametersAuthorIdValid, getAllPosts);
router.get("/:slug", isParamANumber, IsQueryParametersDateValid, IsQueryParametersCityValid, getPostById);

// POST
router.post("/", requireJsonContent, createNewPost);

//PUT
router.put("/:slug", isParamANumber, requireJsonContent, updatePost);

//DELETE
router.delete("/:slug", isParamANumber, deletePost);

//Export
export {router as postsRouter}