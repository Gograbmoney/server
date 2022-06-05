const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require("cors");
const app = express()
const corsOptions = {
    origin: 'https://www.gograbmoney.com',  //https://www.gograbmoney.com & http://localhost:3000         

}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Credentials": "true"});
    next();
  }) 

dotenv.config({ path: './config.env' })

//Database of Mongoose
require('./db/conn')
const PORT = process.env.PORT || 5000;

app.use(cookieParser())
//middleware to get the data from postman 

app.use(express.json());

// to test server configuration
app.get("/",(req,res)=> {
    res.send("Gograbmoney server is running..... ")
})

//giving auth location

app.use("/api/v1",require('./router/auth'))

// for products
const products = require("./router/product");

// for merchant

const merchant = require("./router/merchant")

// for offer

const offer = require("./router/offer")



app.use("/api/v1",merchant);
app.use("/api/v1", products);
app.use("/api/v1",offer);

app.listen(PORT, () => {
    console.log(`port running at port ${PORT}`)
})