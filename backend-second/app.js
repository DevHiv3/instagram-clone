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
import corsOptions, { corsConfig } from "./config/cors.js"
import connectDB from "./config/connect-db.js"
import ChatSocket from "./sockets/chat.js"

const __dirname = import.meta.dirname;
const app = express()

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(passport.initialize());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true, }));

// Routes
app.use(UserRoutes)
app.use(PostRouter)
app.use(StoryRoutes)
app.use(MessageRoutes)
app.use(RoomsRoutes)

//static files
app.use(express.static('./views'))
app.use(express.static(path.join(__dirname, 'views')));
app.get("/view", (req,res)=> res.sendFile(path.join(__dirname, "views", "index.html")))

// connect database
connectDB()

//socket server
export const socketServer = (server)=>{
   const io = new Server(server, { cors: corsConfig });
   io.on("connection", (socket, io)=> ChatSocket(socket, io));
   return io;
}

//centralized error handler
app.use((err, req, res, next) => {
   console.error(err.stack);
   res.status(500).json({ error: 'Something went wrong!' });
 });

export default app