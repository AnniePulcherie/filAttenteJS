import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import ActionModel from "./ActionModel.js";
import Admin from "./Admin.js";
import Dossier from "./dossier.js";
import Fichier from "./Fichier.js";
import NatureFichier from "./NatureFichier.js";

import Role from "./Role.js";
import Visiteurs from "./VisiteurModel.js";

 const { DataTypes } = Sequelize;

export const Users = db.define('users',{
    name:{
        type: DataTypes.STRING,
        allowNull:false
    },
    fonction:{
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
    refresh_token:{
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
});
Role.hasMany(Users);
Users.belongsTo(Role);
Users.hasMany(ActionModel);
ActionModel.belongsTo(Users);
Users.hasMany(Dossier);
Dossier.belongsTo(Users);

Admin.hasMany(Users,{foreignKey:{allowNull:false}})
Users.belongsTo(Admin);


Users.hasMany(NatureFichier);
NatureFichier.belongsTo(Users);
Users.hasMany(Fichier);
Fichier.belongsTo(Users);
//   db.sync().then(() => {
//     console.log('user table created successfully!');
//  }).catch((error) => {
//     console.error('Unable to create table : ', error);
//  });
 


export const Reception = db.define('receptions', {

    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: Users, // 'Movies' would also work
        key: 'id'
      }
    },
    visiteurId: {
      type: DataTypes.INTEGER,
      references: {
        model: Visiteurs, // 'Actors' would also work
        key: 'id'
      }
    },
     
      heureEntrer: {
        type:DataTypes.STRING,
        allowNull:false
    },
    heureSortie: {
      type:DataTypes.STRING,
      allowNull:false
  },
      date: {
         type: DataTypes.STRING, 
         allowNull:true
      },
    }, { timestamps: true });

    Users.belongsToMany(Visiteurs, { through: Reception });
    Visiteurs.belongsToMany(Users, { through: Reception });
   
