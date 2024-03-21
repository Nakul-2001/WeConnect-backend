const express = require('express');
const {app,server} = require('./Socket/Socket')

const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log("Mongo working fine")})
.catch((err)=>{console.log(err)});


const authRoute = require('./Routes/auth');
const userRoute = require('./Routes/user');
const messageRoute = require('./Routes/message');
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/message',messageRoute);


app.get('/',(req,res)=>{
    res.send("Hello from server");
})

server.listen(process.env.PORT,()=>{
    console.log("server working at port no : 3000");
})