import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Fichier from "./Fichier.js";


 const { DataTypes } = Sequelize;

const Dossier = db.define('dossiers',{
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
  
    
}, { timestamps: true },
{
    freezeTableName:true
});
    Dossier.hasMany(Fichier);
    Fichier.belongsTo(Dossier);
 
export default Dossier;