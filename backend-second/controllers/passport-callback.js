import passport from "passport"
import bcrypt from 'bcrypt'
import User from "../models/user.js"
import 'dotenv/config'
import createToken from "../middlewares/create-token.js"

export default async function PassportCallbackURL(req,res) {
    
    const profile = req.user

    const hashedPassword = await bcrypt.hash(profile.emails[0].value, 10);

    const existingUser = await User.findOne({ $or: [{ email: profile.emails[0].value }, { username: profile.displayName }]  });

    if (existingUser) {
        console.log("user already exists!", existingUser)
        const token = createToken(existingUser)
        return res.status(200).redirect(`/verify?token=${token}`)
    }

    const user = {
        username: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        password: hashedPassword,
        timestamp: new Date().toISOString(),
        status: true,
    }

    const newUser = new User(user)
    await newUser.save()

    const token = createToken(newUser)
    console.log(user)
    res.status(200).redirect(`/verify?token=${token}`)
    
}