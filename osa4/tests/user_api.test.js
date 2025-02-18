const bcrypt = require('bcrypt')

const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest');

const { app } = require('../app');
const api = supertest(app)

const { User } = require('../models/user')
const { MONGODB_URI } = require('../utils/config')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await mongoose.connect(MONGODB_URI);
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("secret", 10)
        const testUser = new User({
            username: "test",
            name: "Test User",
            passwordHash
        })

        await testUser.save();
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with a username of length < 3', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(403)

        assert.strictEqual(result.error.text, 'Username minimum length is 3.')
        assert.strictEqual(result.error.status, 403)
    })

    test('creation fails with a password of length < 3', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
        username: 'mlaas',
        name: 'Matti Luukkainen',
        password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(403)

        assert.strictEqual(result.error.text, 'Password minimum length is 3.')
        assert.strictEqual(result.error.status, 403)
    })

    test('creation fails with a missing field', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
        username: '',
        name: 'Matti Luukkainen',
        password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(403)

        assert.strictEqual(result.error.text, 'username and password required.')
        assert.strictEqual(result.error.status, 403)
    })

    test('creation fails with a duplicate username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
        username: 'Matti',
        name: 'Matti Luukkainen',
        password: 'saass22',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const newUser2 = {
            username: 'Matti',
            name: 'Matti Luukkainen',
            password: 'saass',
            }

        const result = await api
            .post('/api/users')
            .send(newUser2)
            .expect(403)

        assert.strictEqual(result.error.text, 'Username must be unique')
        assert.strictEqual(result.error.status, 403)
    })
})
