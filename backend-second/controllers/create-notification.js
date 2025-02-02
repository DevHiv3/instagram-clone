import Notification from '../models/notification.js'
import User from "../models/user.js"
//import getAccessToken from '../config/get-fcm-token.js';
import "dotenv/config"

export default async function CreateNotification(req,res){
    try{

       // const FCM_SERVER_KEY = await getAccessToken();
        const messages = []

        const { message, id, type, action, photo, receiver } = req.body
        const user = await User.findById(receiver)
        const selfUser = await User.findById(req.user.id)

        const FCM_URL = `https://fcm.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/messages:send`;
        const expoUrl = 'https://exp.host/--/api/v2/push/send';

        if(!user.deviceToken){
          console.log(user)
          const notification = new Notification({
            message: message,
            type: type,
            action: action,
            id: id,
            sender: req.user.id,
            receiver: receiver,
            photo: photo,
            timestamp: new Date().toISOString(),
         })
          await notification.save() 
          return res.status(200).json({ message: "success", notification: notification })
        }

        const payload = {
          message: {
            token: user.deviceToken,
            notification: {
              title: 'Hello!',
              body: message,
            },
          },
        };

        // Expo push Token
        
        const messageObj = {
            to: user.deviceToken,
            sound: 'default',
            title: `A user have ${action} ${type == "Post" ? "on your post": "started following you"}`,
            body: message,
            data: { extraData: message },
            "data": {
              "route": "Notification"  // Specify the target route
            }
        }

        messages.push(messageObj)
      
        const response = await fetch(expoUrl, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messages),
          });
      
          const responseData = await response.json();
          if (response.ok) {
            console.log("Notifications sent successfully:", responseData);
          } else {
            console.error("Failed to send notifications:", responseData);
          }
            /*
        
        
          const response = await fetch(FCM_URL, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${FCM_SERVER_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
      
          const data = await response.json();
          console.log('Notification response:', data.error.details);
          */
        
        const notification = new Notification({
            message: message,
            type: type,
            action: action,
            id: id,
            sender: req.user.id,
            receiver: receiver,
            photo: photo,
            timestamp: new Date().toISOString(),
        })
        await notification.save() 
        return res.status(200).json({ message: "success", notification: notification })
        
    } catch(error){
        console.log("Internal Server error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}