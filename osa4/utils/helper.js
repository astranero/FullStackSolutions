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

    const decodedToken = jwt.verify(request.token, SECRET)
    if (!decodedToken.id){
        return response.status(401).json({error: 'Invalid token'})
    }

    request.user = await User.findById(decodedToken.id);
    if (!request.user) {
        return response.status(401).json({ error: 'User not found' });
    }

    next();
} 



module.exports = { extractToken, extractUser };
