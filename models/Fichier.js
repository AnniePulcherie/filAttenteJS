import { Sequelize } from "sequelize";
import db from "../config/Database.js";


 const { DataTypes } = Sequelize;

const Fichier = db.define('fichiers',{
    nom:{
        type: DataTypes.STRING,
        allowNull:false
    },
    nomNature:{
        type: DataTypes.STRING,
        allowNull:false
    },
    nomDossier:{
        type: DataTypes.STRING,
        allowNull:false
    },
   
},{
    freezeTableName:true
});

 
export default Fichier;