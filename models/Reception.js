// import { Sequelize } from "sequelize";
// import db from "../config/Database.js";
// import Users from "./UserModel.js";
// import Visiteurs from "./VisiteurModel.js";

// const { DataTypes } = Sequelize;

// const Reception = db.define('receptions', {

//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Users, // 'Movies' would also work
//       key: 'id'
//     }
//   },
//   visiteurId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Visiteurs, // 'Actors' would also work
//       key: 'id'
//     }
//   },
   
//     heureEntrer: {
//       type:DataTypes.STRING,
//       allowNull:false
//   },
//   heureSortie: {
//     type:DataTypes.STRING,
//     allowNull:false
// },
//     date: {
//        type: DataTypes.STRING, 
//        allowNull:true
//     },
//   }, { timestamps: true });

 
// export default Reception;