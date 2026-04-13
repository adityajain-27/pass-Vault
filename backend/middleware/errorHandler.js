export const createError = (message,statuscode)=>{
    const error = new Error(message);
    error.statuscode = statuscode;
    return error;

};

export const errorHandler = (err,req,res,next)=>{
    console.error("Error:", err.message);
    const status = err.statuscode || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({
        success:false,
        message:message,
    });
};
    