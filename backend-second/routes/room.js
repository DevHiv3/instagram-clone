import express from "express"
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import CreateRoom from "../controllers/create-room.js";
import GetRooms from "../controllers/get-rooms.js";
import GetAllMessages from "../controllers/get-all-messages.js";

const router = express.Router()

router.get("/rooms", authenticate, GetRooms)

router.post("/messages", authenticate, GetAllMessages)

router.post("/create-room", authenticate, CreateRoom)

const RoomsRoutes = router

export default RoomsRoutes