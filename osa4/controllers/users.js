const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User } = require('../models/user')

usersRouter.get("/", async (request, response) => {
    users = await User.find({})
    response.status(201).json(users)
})

const validateUser = async (response, username, password) => {
    if (!(username && password)){
        return response.status(403).send('username and password required.')
    } else if (!(password.length >= 3)){
        return response.status(403).send('Password minimum length is 3.')
    } else if (!(username.length >= 3)){
        return response.status(403).send('Username minimum length is 3.')
    }

    const existsUSer = await User.findOne({ username })
    if (existsUSer){
        return response.status(403).send("Username must be unique")
    }
}

usersRouter.post("/", async (request, response) => {
    const { username, name, password } = request.body

    await validateUser(response, username, password)

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username, 
        name,
        passwordHash
    })

    const savedUser = await user
        .save()
        .catch(e => {
            response.status(403).json(e.message)
        })

    response.status(201).json(savedUser)
})



module.exports = { usersRouter };
