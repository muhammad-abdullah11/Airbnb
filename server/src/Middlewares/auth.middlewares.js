const User  = require("../Models/user.model");
const jwt  = require("jsonwebtoken");

module.exports.isLogin = async(req,res,next)=>{

    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;
    if(!token){
        return res.status(401).json({message:"unauthorized access"})
    }

    try {
        const decoded =   jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!decoded || !user){
        return res.status(401).json({message:"unauthorized access"})
        }
        const userObj = user.toObject();
        delete userObj.password
        req.user = userObj;
        next();

    } catch (error) {
        console.error('JWT verification failed:', error);
        // Token errors (expired / invalid) should return 401 so client can re-auth
        if (error && (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError')) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        res.status(500).json({ message: "Internal server error" });
    }
}