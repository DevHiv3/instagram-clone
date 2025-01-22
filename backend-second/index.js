import http from "http"
import 'dotenv/config'
import app from "./app.js"
import { socketServer } from "./app.js"
import { instrument } from "@socket.io/admin-ui"

const server = http.createServer(app)
socketServer(server)

//instrument(io, { auth: false })
server.listen(8080)
