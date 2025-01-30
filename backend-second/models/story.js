import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const StorySchema = mongoose.Schema({
    user: { type: ObjectId, ref: 'User' },
    type: { type: String, required: true },
    media: { type: String, required: true },
    finish: { type: Number, required: true },
    mentions: [{ type: ObjectId, ref: 'User'}],
    timestamp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 120 }
})


export default mongoose.models.StorySchema || mongoose.model('Story', StorySchema)