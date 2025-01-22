import express from "express"
import passport from "passport"
import path from "path"
import authenticate from "../middlewares/authenticate.js";
import getUserID from "../controllers/get-user-id.js";
import Signup from "../controllers/signup.js";
import Login from "../controllers/login.js";
import upload from "../middlewares/upload.js";
import DeleteUser from "../controllers/delete-user.js";
import SearchUser from "../controllers/search-user.js";
import PassportCallbackURL from "../controllers/passport-callback.js";
import Verification from "../controllers/verification.js";
import VerifyOTP from "../controllers/verify-otp.js";
import EditProfile from "../controllers/edit-user-profile.js";
import Follow from "../controllers/follow.js";
import Unfollow from "../controllers/unfollow.js";
import 'dotenv/config'

const router = express.Router()

router.post("/signup", upload.single("photo"), Signup)

router.post('/login', Login);

router.post('/user/edit/:id', authenticate, upload.single("photo"), EditProfile);

router.get("/user/:id", authenticate, getUserID)

router.delete("/user", authenticate, DeleteUser)

router.put('/follow/:id', authenticate, Follow);

router.put('/unfollow/:id', authenticate, Unfollow);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback', passport.authenticate("google", { session: false }), PassportCallbackURL)

router.get("/verify", authenticate, (req,res)=> res.status(200).json({ message: "success" }))

router.get("/search", authenticate, SearchUser)

router.post("/verification", Verification)

router.post("/verify-otp", VerifyOTP)


const UserRoutes = router

export default UserRoutes 