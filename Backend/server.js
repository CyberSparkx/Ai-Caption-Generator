const express = require('express');
const app= express();
require('dotenv').config();
const connectDB = require('./src/db/db')
const registerRoute = require('./src/routes/register.route')
const loginRoute = require('./src/routes/login.route')
const cookieParser = require('cookie-parser')
const productRoute = require('./src/routes/product.route')
const uploadSongRoute = require('./src/routes/uploadSong.route')
const socketRoute = require('./src/routes/socket.route')
const aiCaptionRoute = require('./src/routes/ing-to-caption.route')
const cors = require('cors')

app.use(express.json());
app.use(cookieParser());
app.use(cors())


connectDB();
app.get('/',(req,res)=>{
    res.send("Hello Bhaiyo");
})

// Authentication Routes
app.use('/api/auth/',registerRoute);
app.use('/api/auth/',loginRoute)
app.use('/api/products/',productRoute)
app.use('/api/upload/',uploadSongRoute)
app.use('/api/',socketRoute)
app.use('/api/',aiCaptionRoute)



app.listen(3000,()=>{
    console.log("Server is running at port 3000");
    
})





// const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const multer = require('multer')
// const app = express();


// const upload = multer({ storage:multer.memoryStorage() })



 




// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });

// io.on("connection", (socket) => {
    
// });

// httpServer.listen(3000);