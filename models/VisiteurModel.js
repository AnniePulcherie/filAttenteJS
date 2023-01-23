import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;


const Visiteurs = db.define('visiteurs',{

    designation:{
        type: DataTypes.STRING,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fonction:{
        type: DataTypes.STRING,
        allowNull: false
    },
    motif:{
        type: DataTypes.STRING,
        allowNull: false
    },
    etat:{
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue: "En attente",
    },
    date:{
        type: DataTypes.STRING,
        allowNull:false
    },
   
    
},{
    freezeTableName:true
});


 
export default Visiteurs;