import express from "express";
import { formularioRegistro} from "../controllers/userController.js";

const router = express.Router();

router.get('/registro', formularioRegistro);

export default router