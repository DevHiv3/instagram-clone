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
import ForgotPassword from "../controllers/forgot-password.js";
import ChangePassword from "../controllers/change-password.js";
import FindUsername from "../controllers/find-username.js";
import FindEmail from "../controllers/find-email.js"
import RemoveFollower from "../controllers/remove-follower.js";
import getPopulatedUsers from "../controllers/get-populated-users.js";
import 'dotenv/config'

const router = express.Router()

router.post("/signup", upload.single("photo"), Signup)

router.post('/login', Login);

router.post('/user/edit/:id', authenticate, upload.single("photo"), EditProfile);

router.get("/user/:id", authenticate, getUserID)

router.get("/populated-user/:id", authenticate, getPopulatedUsers)

router.get("/find-username", FindUsername)

router.get("/find-email", FindEmail)

router.delete("/user", authenticate, DeleteUser)

router.put('/follow/:id', authenticate, Follow);

router.put('/remove-follower/:id', authenticate, RemoveFollower);

router.put('/unfollow/:id', authenticate, Unfollow);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback', passport.authenticate("google", { session: false }), PassportCallbackURL)

router.get("/verify", authenticate, (req,res)=> res.status(200).json({ message: "success" }))

router.get("/search", authenticate, SearchUser)

router.post("/verification", Verification)

router.post("/verify-otp", VerifyOTP)

router.post("/forgot-password", ForgotPassword)

router.post("/change-password", authenticate, ChangePassword)


const UserRoutes = router

export default UserRoutes 