const jwt = require("jsonwebtoken");
const { SECRET } = require("./config");
const { User } = require("../models/user");

const extractToken = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '');
    } else {
        request.token = null;
    }

    next()
} 


const extractUser = async (request, response, next) => {
    if (!request.token){
        request.user = null;
        return next();
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(request.token, SECRET)
    } catch (error) {
        return response.status(401).json({error: 'Invalid token'})
    }

    if (!decodedToken.id) {
        return response.status(401).json({ error: "Invalid token" });
    }

    try {
        request.user = await User.findById(decodedToken.id);
        if (!request.user) {
            return response.status(401).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Database Error:", error.message);
        return response.status(500).json({ error: "Database error while retrieving user" });
    }

    next();
} 



module.exports = { extractToken, extractUser };
