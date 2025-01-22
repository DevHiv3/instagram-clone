import express from "express"
import upload from "../middlewares/upload.js";
import authenticate from "../middlewares/authenticate.js";
import FeedStories from "../controllers/feed-stories.js"
import FindStory from "../controllers/find-story.js"
import CreateStory from "../controllers/create-story.js"
import DeleteStory from "../controllers/delete-story.js"

const router = express.Router();

router.get("/feed-stories/:id", authenticate, FeedStories)

router.get("/story/:id", authenticate, FindStory)

router.post("/story", authenticate, upload.single("photo"), CreateStory)

router.delete("/story/:id", authenticate, DeleteStory)

const StoryRoutes = router

export default StoryRoutes