import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Fichier from "./Fichier.js";
import {Users} from "./UserModel.js";


 const { DataTypes } = Sequelize;

const NatureFichier = db.define('natures',{
    name:{
        type: DataTypes.STRING,
        allowNull:false,
    },
    
},{ timestamps: true },
{
    freezeTableName:true
});

 
export default NatureFichier;