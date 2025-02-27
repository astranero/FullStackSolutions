const {test, describe,  after, beforeEach, before } = require('node:test');
const assert = require('node:assert');

const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt')

const { app } = require('../app');
const api = supertest(app)

const { Blog } = require('../models/blog');
const { User } = require('../models/user');
const { MONGODB_URI } = require('../utils/config');

describe('when there is initially no user at db', () => {
    before(async () => {
        await mongoose.connect(MONGODB_URI)
        await Blog.deleteMany()
        await User.deleteMany()
    })

    after(async () =>  {
        await Blog.deleteMany()
        await User.deleteMany()
        await mongoose.connection.close()
    })

    test('Login gives valid token', async () => {
        await api.post('/api/testing/reset').expect(204)

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const userResponse = await api.post('/api/users').send(newUser)
        console.log("User creation response:", userResponse.body)

        const credentials = { username: 'mluukkai', password: 'salainen' }
        const response = await api
            .post('/api/login')
            .send(credentials)
            .expect(200)
            .expect("Content-Type", /application\/json/)

        assert.notEqual(response.body.token, null)
    })

    test('Login fails with incorrect password', async () => {
        const response = await api
            .post('/api/login')
            .send({username: 'mluukkai', password: 'secret'})
            .expect(401)

        assert.strictEqual(response.body.error, "invalid username or password")

        const loginResponse = await api
            .post('/api/login')
            .send({username: 'test', password: 'salainen'})
            .expect(401)

        assert.strictEqual(loginResponse.body.error, "invalid username or password")
    })
})
