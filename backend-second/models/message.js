import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const MessageSchema = mongoose.Schema({
    type: { type: String, required: true },
	message: { type: String, required: true },
    timestamp: { type: String, required: true },
	seen: { type: Boolean, required: true },
	sender: { type: ObjectId, ref: 'User' },
	receiver: { type: ObjectId, ref: 'User' },
	room: { type: ObjectId, ref: 'Room' }
})

const Message = mongoose.model('Message', MessageSchema)

export default Message 



