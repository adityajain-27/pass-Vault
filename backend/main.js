import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import connectDB from "./config/db.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import vaultRoutes from "./routes/vault_routes.js";
import utilsRoutes from "./routes/utils.routes.js";
import dns from 'dns';
dns.setServers(["1.1.1.1" , "8.8.8.8"]);
dotenv.config();
connectDB();



const app = express();
const PORT = process.env.PORT || 5000
app.use(helmet());
app.use(cors({origin:process.env.FRONTEND_URL,credentials:true}))
app.use(express.json())
app.use(globalLimiter);      

//routes
app.use("/api/auth",authRoutes);
app.use("/api/vault",vaultRoutes);
app.use("/api/utils", utilsRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});
app.use((req, res, next) => {
    const error = new Error("Route not found");
    error.statuscode = 404;
    next(error);
    // res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler); 

app.listen(PORT,()=>{
    console.log(`Server is Running on PORT ${PORT}`);
})
