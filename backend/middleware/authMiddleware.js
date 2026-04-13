import jwt from "jsonwebtoken";

export const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message:"Authorization header missing or invalid"});
    }
    const token = authHeader.split(" ")[1];
    try{

        if(!token){
            return res.status(401).json({message:"Token is missing"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({message:"Invalid or Expired Token"})
    }
}