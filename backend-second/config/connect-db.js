import mongoose from "mongoose"

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.2mimf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

export default async function connectDB(){
  try{
    await mongoose.connect(url, { useUnifiedTopology: true })
    console.log("DB connected")

  } catch(error){
   console.log(error)
  }
}

