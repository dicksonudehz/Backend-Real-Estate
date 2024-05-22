import  express  from "express";
import { createResidency, deleteResidence, getAllResidencies, getResidenceById } from "../controller/residenceCntrl.js";
import jwtcheck from "../config/authconfig.js";

const router = express.Router();

router.post("/create", createResidency);
router.get("/getAll", getAllResidencies)
router.get("/:id", getResidenceById)
router.delete("/:id", deleteResidence)

export {router as residenceRoute}