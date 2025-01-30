const productionUrl = "https://instagram-clone-qoyv.onrender.com"
const localHostUrl = "http://192.168.29.244:8080"
const socketAdminUrl = "https://admin.socket.io"
const socketUrl = "http://localhost:8080"

const corsOptions = {
    origin: [productionUrl, localHostUrl],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  };

  export const corsConfig = {
    origin: [socketUrl, socketAdminUrl],
    methods: ["GET", "POST"],
    credentials: true,
  }

export default corsOptions
  