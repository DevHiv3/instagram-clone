import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const RoomSchema = mongoose.Schema({
    message: { type: String, required: true },
    messageTimestamp: { type: String, required: true },
    timestamp: { type: String, required: true },
    latestMessageTimestamp: { type: String, required: true },
    users: [{ type: ObjectId, ref: 'User' }]
})

export default mongoose.models.RoomSchema || mongoose.model('Room', RoomSchema)