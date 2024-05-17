const express = require("express");

const app = express();

app.get("/",(req,res)=>{
    res.send("Hello World");
});

PORT = 8000
app.listen(8000,(req,res)=>{
    console.log(`Server is running on port ${PORT}`);
})