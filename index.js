import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/Database.js";
import router from "./routes/index.js";
import http from "http";
import {Server} from "socket.io";
import fileupload from "express-fileupload";

dotenv.config();
const app = express();

const server = http.createServer(app);



app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(
    fileupload({
        createParentPath: true,
    }),
);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    },
});
try {
   
    await db.authenticate();
    console.log('Database Connected...');

    io.on("connection", (socket)=>{
        console.log(`user connected: ${socket.id}`);
        socket.on("send_message_directeur",(data)=>{
           socket.broadcast.emit("receive_message_directeur", data);

        });

        socket.on("send_message_secretaire",(data)=>{
            socket.broadcast.emit("receive_message_secretaire", data);
 
         });

    });

    
} catch (error) {
    console.error(error);
}




app.use(router);

server.listen(5000, ()=> {console.log('Server running at port 5000')
}
);