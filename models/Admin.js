import { Sequelize } from "sequelize";
import db from "../config/Database.js";


 const { DataTypes } = Sequelize;

const Admin = db.define('Admin',{
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
   
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    
},{
    freezeTableName:true
});

db.sync().then(() => {
    console.log('user Role created successfully!');
 }).catch((error) => {
    console.error('Unable to create table : ', error);
 });
 
 
export default Admin;