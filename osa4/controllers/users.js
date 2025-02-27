const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User } = require('../models/user')

usersRouter.get("/", async (request, response) => {
    users = await User.find({})
    response.status(201).json(users)
})

const validateUser = async (response, username, password) => {
    if (!(username && password)){
        throw new Error('Username and password required.');
    } else if (!(password.length >= 3)){
        throw new Error('Password minimum length is 3.');
    } else if (!(username.length >= 3)){
        throw new Error('Username minimum length is 3.');
    }

    const existsUSer = await User.findOne({ username })
    if (existsUSer){
        throw new Error('Username must be unique.');
    }
}

usersRouter.post("/", async (request, response) => {
    try {
        const { username, name, password } = request.body

        await validateUser(response, username, password)

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
    
        const user = new User({
            username, 
            name,
            passwordHash
        })
    
        const savedUser = await user.save()
        response.status(201).json(savedUser)
    } catch (error){
        console.log(error)
        response.status(403).json({ error: error.message })
    }
})



module.exports = { usersRouter };
