import express from "express"
import morgan from "morgan"
import cors from "cors"
import fetch from "node-fetch"
import 'dotenv/config'
import path from "path"
import { Server } from 'socket.io';
import session from 'express-session';
import UserRoutes from "./routes/user.js"
import PostRouter from "./routes/posts.js"
import StoryRoutes from "./routes/story.js"
import MessageRoutes from "./routes/message.js"
import RoomsRoutes from "./routes/room.js"
import passport from "./config/passport.js"
import connectDB, { corsConfig } from "./config/connect-db.js"
import ChatSocket from "./sockets/chat.js"

const __dirname = import.meta.dirname;
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(morgan('dev'))
app.use(UserRoutes)
app.use(PostRouter)
app.use(StoryRoutes)
app.use(MessageRoutes)
app.use(RoomsRoutes)
app.use(express.static('./views'))
app.use(express.static(path.join(__dirname, 'views')));
app.use(passport.initialize());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true, }));
 
connectDB()

export const socketServer = (server)=>{
   const io = new Server(server, { cors: corsConfig });
   io.on("connection", (socket, io)=> ChatSocket(socket, io));
   return io;
}

app.get("/view", (req,res)=> res.sendFile(path.join(__dirname, "views", "index.html")))

export default app