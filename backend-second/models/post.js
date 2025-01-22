import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const PostSchema = mongoose.Schema({
    admin: { type: ObjectId, ref: 'User' },
    caption: { type: String, required: true },
    type: { type: String, required: true },
    photo: { type: String, required: true },
    mentions: [{ type: ObjectId, ref: 'User'}],
    timestamp: { type: String, required: true },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{ _id: ObjectId, text: String, timestamp: String, postedBy: { type: ObjectId, ref: 'User' } }]
})


export default mongoose.models.Post || mongoose.model('Post', PostSchema)