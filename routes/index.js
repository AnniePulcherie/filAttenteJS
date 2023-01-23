import express from "express";
import { getUsers, Register, Login, Logout, VisiteurRegister, 
    getVisiteur, updateVisiteur, deleteVisiteur, CreerRole, 
    getRoles, getUnRole, CreerAction, getActions, getUneAction, 
    getAllVisiteur, CreerDossier, getDossiers, CreerFichier, 
    getFichiers, uploadFichier, CreerNature, getNature, postReception} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";


const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

//visiteur

router.get("/visiteur", getVisiteur);
router.get("/visiteur/liste", getAllVisiteur);
router.post("/visiteur/ajouter",VisiteurRegister);
router.put("/visiteur/:id", updateVisiteur);
router.delete("/visiteur/:id", deleteVisiteur);

//+++++++++++++++++++++++++++++++++RECEPTION+++++++++++++++++++++++++++++++++++

router.post("/reception", postReception);

//+++++++++++++++++++++++++++++++++++RECEPTION+++++++++++++++++++++++++++++++++


//++++++++++++++++++++++++++++++++++ROUTE ROLE++++++++++++++++++++++++++++
    router.post("/role", CreerRole);
    router.get("/role",getRoles);
    router.get("/role/:id",getUnRole);
//+++++++++++++++++++++++++++++++++++FIN ROLE +++++++++++++++++++++++++++++

//+++++++++++++++++++++++++++++++++++ACTION++++++++++++++++++++++++++++++++

router.post("/action",CreerAction);
router.get("/action",getActions);
router.get("/action/:id",getUneAction);

//++++++++++++++++++++++++++++++++++++++++DOSSIER+++++++++++++++++++++++++++
router.post("/dossier",CreerDossier);
router.get("/dossier",getDossiers);
//++++++++++++++++++++++++++++++++++++NATURE+++++++++++++++++++++++++++++++

router.post("/nature",CreerNature);
router.get("/nature",getNature)
//+++++++++++++++++++++++++++++++++++++++++++++FICHIER+++++++++++++++++++++++++
router.post("/upload-file",uploadFichier);
router.post("/fichier",CreerFichier);
router.get("/fichier", getFichiers);

export default router;