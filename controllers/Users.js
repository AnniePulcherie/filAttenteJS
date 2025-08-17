import {Users, Reception} from "../models/UserModel.js";
import Visiteurs from "../models/VisiteurModel.js";

import Fichier from "../models/Fichier.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Dossier from "../models/dossier.js";
import NatureFichier from "../models/NatureFichier.js";
import ActionModel from "../models/ActionModel.js";
import Role from "../models/Role.js";
import nodemailer from "nodemailer";

// ---------------------------------ROLES------------------------------------------

// +++++++++++++++++++++++++++++++++++creation de Role
export const CreerRole = async(req, res) => {
    const  name = req.body.name;
    console.log(name);
    try {
        await Role.create({
            name: name,
        });
        res.json({msg: "enregistrement reussi"});
    } catch (error) {
        console.log(error);
    }
}

// +++++++++++++++++++++++++++++++++++++ Liste +++++++++++++++++++++

export const getRoles = async(req, res) => {
    try {
        const roles = await Role.findAll({
            attributes:['id','name']
        });
        res.json(roles);
    } catch (error) {
        console.log(error);
    }
}
//+++++++++++++++++++++++++++++++++++++ RECUPERER UN ROLE +++++++++++++++++++++++++
export const getUnRole = async(req, res) => {
   const id = req.body;
    try {
        const role = await Role.findAll({   
            where:{id:id},  
            attributes:['id','name']
        });
        console.log(role);
        res.json(role);
    } catch (error) {
        console.log(error);
    }
}


// --------------------------------FIN ROLE-----------------------------------------



//--------------------------------USER----------------------------------------------

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['id','name','fonction','email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { name, fonction,email, password, confPassword } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password dan Confirm Password tidak cocok"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    console.log(fonction);
    try {
        await Users.create({
            name,
            fonction,
            email: email,
            password: hashPassword,
            AdminId:1,
        });
        res.json({msg: "enregistrement reussi"});
        // sendMail(email,password);
    } catch (error) {
        console.log(error);
    }
}

export const Login = async (req, res) => {
    try {
        // Utiliser findOne pour récupérer un seul utilisateur
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });

        // 1. Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ msg: "Email n'existe pas" });
        }

        // 2. Comparer le mot de passe haché
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ msg: "Mot de passe incorrect" });
        }

        // 3. Créer les tokens
        const userId = user.id;
        const name = user.name;
        const fonction = user.fonction;
        const email = user.email;

        const accessToken = jwt.sign({ userId, name, fonction, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        });
        const refreshToken = jwt.sign({ userId, name, fonction, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        // 4. Mettre à jour le refresh token
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });

        // 5. Définir le cookie et envoyer la réponse
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken, fonction });

    } catch (error) {
        // En cas d'erreur inattendue (ex: problème de connexion à la DB)
        console.error(error);
        res.status(500).json({ msg: "Erreur serveur" });
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}


// visiteur

let d = new Date();
let daty = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
export const getVisiteur = async(req, res) => {
   const etat ="Entrer" ;
    try {
        const visit = await Visiteurs.findAll({   
            where:{date:daty,
                    
            },  
            attributes:['id','designation','name','fonction','motif','etat']
        });
        console.log(visit);
        res.json(visit);
    } catch (error) {
        console.log(error);
    }
}

export const getAllVisiteur = async(req, res) => {
   
    try {
        const visit = await Visiteurs.findAll({    
            attributes:['id','designation','name','fonction','motif','etat']
        });
        console.log(visit);
        res.json(visit);
    } catch (error) {
        console.log(error);
    }
}

export const VisiteurRegister = async(req, res) => {
    const { designation,name,fonction, motif } = req.body;
    console.log(req.body);
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    
    try {
    const visite = await Visiteurs.create({
            designation,
            name,
            fonction,
            motif,
            idUsers:user[0].id,
            date:daty,
           
        });
        res.json(visite);
       
    } catch (error) {
        console.log(error);
    }

}

export const getVisite = async ()=>{
    const singleVisiteur = Visiteurs.filter((vst)=>vst.id === req.params.id);
    res.send(singleVisiteur);
}


export const getOneVisiteur = async ()=>{
    const visit = await Visiteurs.findByPk(id);
    if (!visit) throw 'visiteur not found';
    return visit;
}


export const updateVisiteur = async (req,res)=>{
   
    const { designation,name,fonction, motif,etat,date } = req.body;
    
    
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    
    console.log(req.body);

    try {
        const visite = await Visiteurs.findByPk(req.params.id);
        if(visite)
        {
            await Visiteurs.update(
                {
                    designation,
                    name,
                    fonction,
                    motif,
                    etat,
                    idUsers:user[0].id,
                    date,
                },
                {
                    where:{id :visite.id }
                }
            );
        }
            res.json(visite);
       

    console.log("update");
}catch(error){
        console.log(error);
    }
}

export const deleteVisiteur = async (req,res)=>{
    const visiteur = await Visiteurs.findByPk(req.params.id);
        if(visiteur){
            await Visiteurs.destroy({
                where:{
                    id:visiteur.id
                }
            });
        }
    if(!visiteur) console.log(error)
}


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++// dossier
export const CreerDossier = async(req, res) => {
    const  name  = req.body.name;
    console.log(req.body);
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    
    try {
    const dossier = await Dossier.create({
           
            name,
            userId:user[0].id,
           
           
        });
        res.json(dossier);
    } catch (error) {
        console.log(error);
    }

}

export const getDossiers = async(req, res) => {
    try {
        const dossier = await Dossier.findAll({
            attributes:['id','name']
        });
        res.json(dossier);
    } catch (error) {
        console.log(error);
    }
}

// nature 

export const CreerNature = async(req, res) => {
    const  name  = req.body.name;
    console.log(req.body);
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    
    try {
    const nature = await NatureFichier.create({
           
            name,
            userId:user[0].id,
          
        });
        res.json(nature);
    } catch (error) {
        console.log(error);
    }

}

export const getNature = async(req, res) => {
    try {
        const nature = await NatureFichier.findAll({
            attributes:['id','name']
        });
        res.json(nature);
    } catch (error) {
        console.log(error);
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++Fichier

export const uploadFichier = async(req,res)=>{

    try {
        if (!req.files) {
            res.send({
                status: "failed",
                message: "No file uploaded",
            });
        } else {
            let file = req.files.file;

            console.log(req.files);

            file.mv("./uploads/" + file.name);

            res.send({
                status: "success upload",
                message: "File is uploaded",
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size,
                },
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
}
//++++++++++++++++++++++++++++++++++++++++++++++++++FICHIER

    // handle storage using multer

    export const uploadStorage = ()=>{
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
               cb(null, 'uploads');
            },
            filename: function (req, file, cb) {
               cb(null, `${file.fieldname}-${Date.now()}+${file.originalname}`);
            }
         });
          
         var upload = multer({ storage: storage });
         const strg = upload.single('dataFile')
         return(strg);
    }
//  // handle single file upload
//  export const importerFichier = async (req, res, next) => {
//     const file = req.file;
//     const {nomNature, nomDossier} = req.body;
//     console.log(nomNature);
//     console.log(nomDossier);
//     if (!file) {
//        return res.status(400).send({ message: 'Please upload a file.' });
//     }

//     try {
//         await Fichier.create({
//             nom: req.file.filename,
//             nomNature,
//             nomDossier,
//         });
//         res.json({msg: "enregistrement reussi"});
//     } catch (error) {
//         console.log(error);
//     }

// };

export const CreerFichier = async(req, res) => {
    const  {nom, nature,dossier } = req.body;
    console.log(req.body);
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    
    try {
    const fichier = await Fichier.create({
           
            nom,
            idUser:user[0].id,
            nature,
            dossier,
           
        });
        res.json(fichier);
    } catch (error) {
        console.log(error);
    }

}

export const getFichiers = async(req, res) => {
    try {
        const fichier = await Fichier.findAll({
            attributes:['id','name','nature',"dossier"]
        });
        res.json(fichier);
    } catch (error) {
        console.log(error);
    }
}

//--------------------------------CREER ACTION

export const CreerAction = async(req, res) => {
    const  nom = req.body.etat;
    console.log(req.body.etat);
    
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    try {
    const action = await ActionModel.create({
           
            name:nom,
            userId:user[0].id,
          
        });
        res.json(action);
    } catch (error) {
        console.log(error);
    }

}

export const getActions = async(req, res) => {
    try {
        const action = await ActionModel.findAll({
            attributes:['id','name','userId']
        });
        res.json(action);
    } catch (error) {
        console.log(error);
    }
}

export const getUneAction = async(req, res) => {
    const id = req.body;
     try {
         const action = await Role.findAll({   
             where:{id:id},  
             attributes:['id','name','userId']
         });
         console.log(action);
         res.json(action);
     } catch (error) {
         console.log(error);
     }
 }
 
//++++++++++++++++++++++++++++++++++++++++++RECEPTION VISITEUR+++++++++++++++++++++++++++

export const postReception = async(req, res) => {
    const  {visiteurId,heureEntrer,heureSortie,date,userId} = req.body;
    console.log(req.body);
    
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.status(204);
    console.log(user[0].id)
    try {
    const reception = await Reception.create({
           
            heureEntrer,
            heureSortie,
            date,
            userId,
            visiteurId,
            
          
        });
        res.json(reception);
    } catch (error) {
        console.log(error);
    }

}

//-------------------------------------------------------------------------------------------
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const sendMail = (mail, password)=>{
        const mailTransporter = nodemailer.createTransport({
            service:'gmail',
            auth: {
                user:'roudaannie@gmail.com',
                pass:'annie123'
            }
        });
        let details = {
            from: "roudaannie@gmail.com",
            to: mail,
            subject: "identification",
            text: `Bonjour, voici votre identifiant pour accéder à notre plateforme. Mail: ${mail}, password: ${password}`
        }
        mailTransporter.sendMail(details, (err)=>{
            if(err){
                console.log("il y a un erreur",err);
            }else{
                console.log("email envoyé");
            }
        })
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
