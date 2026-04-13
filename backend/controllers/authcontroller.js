import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req, res) => {
    try {
        const { email, masterPasswordHash } = req.body
        if (!email || !masterPasswordHash) {
            return res.status(400).json({ message: "Please Provide Email and Password!" })

        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User Already Exists!" })
        }

        const hash = await bcrypt.hash(masterPasswordHash, 10)
        const newuser = new User({
            email,
            masterPasswordHash: hash
        })
        await newuser.save()
        res.status(201).json({ message: "User Created Successfully" })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, masterPasswordHash } = req.body;
        
        if (!email || !masterPasswordHash) {
            return res.status(400).json({ message: "Please Provide Email and Password!" });
        }
        
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(masterPasswordHash, user.masterPasswordHash);
        
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        
        const accessToken = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: "15m" }
        );
        
        const refreshToken = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', 
            { expiresIn: "7d" }
        );
        
        user.refreshToken = refreshToken;
        await user.save();
        
        res.status(200).json({
            message: "Login Successful",
            accessToken,
            refreshToken
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        // find the user who owns this refresh token
        const user = await User.findOne({ refreshToken });

        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // verify the token is not expired or tampered with
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // issue a brand new access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
        );

        res.status(200).json({ accessToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        // find the user and wipe their refresh token from the DB
        const user = await User.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.status(200).json({ message: "Logged out" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
