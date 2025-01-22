import express from "express"
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import GetAllPosts from "../controllers/get-all-posts.js"
import FindPost from "../controllers/find-post.js"
import CreatePost from "../controllers/create-post.js"
import EditPost from "../controllers/edit-post.js"
import GetProfilePosts from "../controllers/get-profile-posts.js";
import DeletePost from "../controllers/delete-post.js"
import LikePost from "../controllers/like-post.js";
import UnlikePost from "../controllers/unlike-post.js";
import DeleteComment from "../controllers/delete-comment.js";
import AddComment from "../controllers/add-comment.js";
import Feed from "../controllers/feed.js";

const router = express.Router();

router.get("/posts", authenticate, GetAllPosts)

router.get("/feed/:id", authenticate, Feed)

router.get("/post/:id", authenticate, FindPost)

router.get("/profile-posts/:id", authenticate, GetProfilePosts)

router.post("/post", authenticate, upload.single("photo"), CreatePost)

router.post("/post/edit/:id", authenticate, upload.single("photo"), EditPost)

router.delete("/post/:id", authenticate, DeletePost)

router.put("/post/like/:id", authenticate, LikePost)

router.put("/post/unlike/:id", authenticate, UnlikePost)

router.put("/post/comment/:id", authenticate, AddComment)

router.delete("/post/comment/:id", authenticate, DeleteComment)

const PostRoutes = router

export default PostRoutes