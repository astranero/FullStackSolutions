const bcrypt = require('bcrypt')

const { test, describe, beforeEach, after, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest');

const { app } = require('../app');
const api = supertest(app)

const { User } = require('../models/user')
const { Blog } = require('../models/blog')
const { MONGODB_URI } = require('../utils/config')

describe('when there is initially one user at db', () => {
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

    test('creation succeeds with a fresh username', async () => {
        await api.post('/api/testing/reset').expect(204)

        const newUser = {
            username: 'fresh',
            name: 'Matti Freshi',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.statusCode, 201)
    })

    test('creation fails with a username of length < 3', async () => {
        const newUser = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(403)

        assert.strictEqual(result.error.text, '{"error":"Username minimum length is 3."}')
        assert.strictEqual(result.error.status, 403)
    })

    test('creation fails with a password of length < 3', async () => {
        const newUser = {
            username: 'test',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .set('Content-Type', 'application/json')
            .send(newUser)
            .expect(403)

        assert.strictEqual(result.body.error, 'Password minimum length is 3.')
    })

    test('creation fails with a missing field', async () => {
        const newUser = {
            username: 'uniikki',
            name: 'Matti Luukkainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(403)

        assert.strictEqual(result.body.error,  'Username and password required.')
    })

    test('creation fails with a duplicate username', async () => {
        await api.post('/api/testing/reset').expect(204)

        const newUser = {
            username: 'mluukkainen',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const secUser = {
            username: 'mluukkainen',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(secUser)
            .expect(403)

        assert.strictEqual(result.body.error, 'Username must be unique.')
    })
})
