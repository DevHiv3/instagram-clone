import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const NotificationSchema = mongoose.Schema({
    message: { type: String, required: true },
    type: { type: String, required: true },
    id: { type: String, required: true },
    photo: { type: String, required: true },
    action: { type: String, required: true },
    timestamp: { type: String, required: true },
    sender: { type: ObjectId, ref: 'User' },
    receiver: { type: ObjectId, ref: 'User' },
})

const Notification = mongoose.model('Notification', NotificationSchema)

export default Notification 



