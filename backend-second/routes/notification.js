import express from "express"
import authenticate from "../middlewares/authenticate.js";
import ReceiveNotification from "../controllers/receive-notification.js";
import CreateNotification from "../controllers/create-notification.js"
import AddPushToken from "../controllers/add-push-token.js";

const router = express.Router()

router.get("/receive-notifications", authenticate, ReceiveNotification)

router.post("/create-notification", authenticate, CreateNotification)

router.post("/add-push-token", authenticate, AddPushToken)

const NotificationRoutes = router

export default NotificationRoutes