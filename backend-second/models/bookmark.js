import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const BookMarkSchema = mongoose.Schema({
    markedBy: { type: ObjectId, ref: 'User' },
    photo: { type: String, required: true },
    timestamp: { type: String, required: true },
    post: { type: ObjectId, ref: 'Post' },
})


export default mongoose.models.BookMark || mongoose.model('BookMark', BookMarkSchema)