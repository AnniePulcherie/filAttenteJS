import {Sequelize} from "sequelize";

const db = new Sequelize('fil_d_attente','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db;

