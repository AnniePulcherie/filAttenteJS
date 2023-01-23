import  express  from "express";
import { getVisiteur, Register } from "../controllers/Visiteurs";

const routeV = express.Router();

routeV.get("/visiteur",getVisiteur);
routeV.post("/ajouter",Register);