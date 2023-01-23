import { Sequelize } from "sequelize";
import db from "../config/Database.js";

import {Users} from "./UserModel.js";

const { DataTypes } = Sequelize;

const ActionModel = db.define('actions',{
    name:{
        type: DataTypes.STRING
    },
   
    
}, { timestamps: true },
{
    freezeTableName:true
});

 
export default ActionModel;