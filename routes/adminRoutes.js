import express from "express";
import { vistaTemporal} from "../controllers/adminController.js";

const router = express.Router();

router.get('/admin', vistaTemporal);

export default router