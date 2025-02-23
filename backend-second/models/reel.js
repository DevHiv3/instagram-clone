import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const ReelSchema = mongoose.Schema({
    admin: { type: ObjectId, ref: 'User' },
    caption: { type: String, required: true },
    url: { type: String, required: true },
    timestamp: { type: String, required: true },
    likes: [{ type: ObjectId, ref: 'User' }],
    comments: [{ _id: ObjectId, text: String, timestamp: String, postedBy: { type: ObjectId, ref: 'User' } }]
})


export default mongoose.models.Reel || mongoose.model('Reel', ReelSchema)