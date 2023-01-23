

import Visiteurs from "../models/VisiteurModel";

export const getVisiteur = async(req, res) => {
    try {
        const visit = await Visiteurs.findAll({
            attributes:['designation','name','fonction','motif','etat']
        });
        console.log(visit);
        res.json(visit);
    } catch (error) {
        console.log(error);
    }
}


export const Register = async(req, res) => {
    const { designation,name,fonction, motif } = req.body;
   
    try {
    const visite = await Visiteurs.create({
            designation,
            name,
            fonction,
            motif,
           
        });
        res.json(visite);
    } catch (error) {
        console.log(error);
    }
}