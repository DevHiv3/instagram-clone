import mongoose from "mongoose"
const { ObjectId } = mongoose.Schema.Types

const UserSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, unique: true },
	photo: { type: String, required: true },
	status: { type: Boolean, required: true },
	otp: { type: Number, unique: true },
	timestamp: { type: String, required: true },
	followings: [{ type: ObjectId, ref: 'User' }],
	followers: [{ type: ObjectId, ref: 'User' }]
})


export default mongoose.models.User || mongoose.model('User', UserSchema)