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
        await mongoose.connect(MONGODB_URI);
        await Blog.deleteMany({});
        await User.deleteMany({});
    });

    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});

        const testUser = new User({
            username: 'test',
            name:'Test User',
            passwordHash: await bcrypt.hash('secret', 10)
        })

        await testUser.save();
    })

    test('Login gives valid token', async () => {
        const credentials = {username: 'test', password: 'secret'}

        const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(200)

        assert.notEqual(response.body.token, null)
    })

    test('Login fails with incorrect password', async () => {
        const credentials = {username: 'test', password: '2secret'}

        const response = await api
        .post('/api/login')
        .send(credentials)
        .expect(401)

        assert.strictEqual(response.body.error, "invalid username or password")
    })

    after(async () =>  {
        await mongoose.connection.close()
    })
})
