
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express()
const corsOptions = {
    origin: 'http://localhost:3000',  //https://gograbmoney.com & http://localhost:3000
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration


dotenv.config({ path: './config.env' })

//Database of Mongoose
require('./db/conn')
const PORT = process.env.PORT || 5000;

app.use(cookieParser())
//middleware to get the data from postman 

app.use(express.json());

//giving auth location

app.use("/api/v1",require('./router/auth'))

// for products
const products = require("./router/product");

app.use("/api/v1", products);

app.listen(PORT, () => {
    console.log(`port running at port ${PORT}`)
})