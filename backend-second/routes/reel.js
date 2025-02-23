import express from "express"
import reel from "../middlewares/upload-reel.js";
import authenticate from "../middlewares/authenticate.js";
import FindReel from "../controllers/find-reel.js"
import CreateReel from "../controllers/create-reel.js"
import EditReel from "../controllers/edit-reel.js"
import DeleteReel from "../controllers/delete-reel.js"
import LikeReel from "../controllers/like-reel.js";
import UnlikeReel from "../controllers/unlike-reel.js";
import DeleteReelComment from "../controllers/delete-reel-comment.js";
import AddReelComment from "../controllers/add-reel-comment.js";
import ReelFeed from "../controllers/reel-feed.js";
import GetProfileReels from "../controllers/get-profile-reels.js";

const router = express.Router();

router.get("/reels", authenticate, ReelFeed)

router.get("/reel/:id", authenticate, FindReel)

router.get("/reels/:id", authenticate, GetProfileReels)

router.post("/reel", authenticate, reel.single("url"), CreateReel)

router.post("/post/edit/:id", authenticate, reel.single("url"), EditReel)

router.delete("/reel/:id", authenticate, DeleteReel)

router.put("/reel/like/:id", authenticate, LikeReel)

router.put("/reel/unlike/:id", authenticate, UnlikeReel)

router.put("/reel/comment/:id", authenticate, AddReelComment)

router.delete("/reel/comment/:id", authenticate, DeleteReelComment)

const ReelRoutes = router

export default ReelRoutes