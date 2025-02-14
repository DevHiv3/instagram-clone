import http from "http";
import 'dotenv/config';
import app from "./app.js";
import { socketServer } from "./app.js";
import { nextServer } from "./app.js";

const server = http.createServer(app);

nextServer(server)
socketServer(server)

