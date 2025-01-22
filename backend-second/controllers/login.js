import 'dotenv/config'
import User from "../models/user.js"
import bcrypt from 'bcrypt'
import createToken from '../middlewares/create-token.js';

export default async function Login(req,res){
  
    const { email, password } = req.body;
    
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          
          return res.status(403).json({ message: 'User not found' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        const token = createToken(user);
        res.status(200).json({ message: 'success', token, id: user._id  });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
    
}