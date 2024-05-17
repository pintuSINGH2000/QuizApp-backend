const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
connectDB();

app.get("/",(req,res)=>{
    res.send("Hello World");
});

PORT = 8000
app.listen(8000,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})