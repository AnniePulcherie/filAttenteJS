import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import {Users} from "./UserModel.js";

 const { DataTypes } = Sequelize;

const Role = db.define('roles',{
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
   
},{
    freezeTableName:true
});

   
//   db.sync().then(() => {
//     console.log('user Role created successfully!');
//  }).catch((error) => {
//     console.error('Unable to create table : ', error);
//  });
 
export default Role;