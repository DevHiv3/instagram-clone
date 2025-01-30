import express from "express"
import authenticate from "../middlewares/authenticate.js";
import GetBookMarks from "../controllers/get-bookmarks.js"
import CreateBookMark from "../controllers/create-bookmark.js"
import DeleteBookMark from "../controllers/delete-bookmark.js"
import FindBookMarks from "../controllers/find-bookmarks.js";

const router = express.Router();

router.get("/bookmarks", authenticate, GetBookMarks)

router.get("/find-bookmarks", authenticate, FindBookMarks)

router.post("/bookmark", authenticate, CreateBookMark)

router.delete("/bookmark/:id", authenticate, DeleteBookMark)

const BookMarkRoutes = router

export default BookMarkRoutes