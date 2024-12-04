import express from "express";
import { formularioRegistro, registrar } from "../controllers/staffController.js";

const router = express.Router();

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

export default router