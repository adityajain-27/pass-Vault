import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();
const app = express();
const PORT = process.env.PORT || 5000

app.get("/",(req,res)=>{
    res.send("Hello World Setting things for Pass-Vault Manager")
})
app.use(errorHandler); 

app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`);
})
