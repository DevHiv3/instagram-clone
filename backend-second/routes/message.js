import express from "express"
import mongoose from "mongoose"
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js"
import Message from "../models/message.js"

const router = express.Router()

const MessageRoutes = router

export default MessageRoutes