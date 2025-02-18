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

        const testUser2 = new User({
            username: 'test2',
            name:'Test User',
            passwordHash: await bcrypt.hash('secret', 10)
        })

        await testUser.save();
        await testUser2.save();

        const listWithManyBlog = [
            {
                _id: "5a422a851b54a676234d17f7",
                title: "React patterns",
                author: "Michael Chan",
                url: "https://reactpatterns.com/",
                likes: 7,
                __v: 0
            },
            {
                _id: "5a422aa71b54a676234d17f8",
                title: "Go To Statement Considered Harmful",
                author: "Edsger W. Dijkstra",
                url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
                likes: 5,
                __v: 0
            },
            {
                _id: "5a422b3a1b54a676234d17f9",
                title: "Canonical string reduction",
                author: "Edsger W. Dijkstra",
                url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
                likes: 12,
                __v: 0
            },
            {
                _id: "5a422b891b54a676234d17fa",
                title: "First class tests",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
                likes: 10,
                __v: 0
            },
            {
                _id: "5a422ba71b54a676234d17fb",
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
                __v: 0
            }
        ]

        await Blog.insertMany(listWithManyBlog);
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })


    test('get returns correct amount of blogs', async () => {
        const result = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.length, 5)
    })

    test('get returns correct `id` format (not _id)', async () => {
        const result = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        result.body.map( blog => {
            assert('id' in blog)
        })
    })

    test('post request to api/blogs works with a token', async () => {
        const login = await api
            .post('/api/login')
            .send({username: 'test', password: 'secret'})
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const token = login.body.token;

        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const result = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(initBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(result.body.title, initBlog.title)

        const newBlog = await Blog.findById(result.body.id).exec()
        assert.strictEqual(newBlog.title, initBlog.title)
    })


    test('post request fail a without token', async () => {

        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const result = await api
            .post('/api/blogs')
            .send(initBlog)
            .expect(401)

        assert.strictEqual(result.body.error, "token missing or invalid")
    })


    test('if likes not given set to 0', async () => {
        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const login = await api
        .post('/api/login')
        .send({username: 'test', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const token = login.body.token;
        const response = await api

        .post('/api/blogs')
        .send(initBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/);

        assert.strictEqual(response.body.likes, 0)
    })


    test('if no url or title return bad request', async () => {
        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin"
        }  
        const login = await api
        .post('/api/login')
        .send({username: 'test', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const token = login.body.token;
        const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(initBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    })


    test('testing to add and delete blog', async () => {
        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const login = await api
        .post('/api/login')
        .send({username: 'test', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const token = login.body.token;
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(initBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const newBlog = await Blog.findById(response.body.id).exec();
        assert.strictEqual(newBlog.title, initBlog.title)

        const deleteResponse = await api
            .delete(`/api/blogs/${response.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const deletedBlog = await Blog.findById(response.body.id).exec();
        assert.strictEqual(deletedBlog, null)
    })


    test('add by user 1 and delete blog by user2 should fail', async () => {
        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const login = await api
        .post('/api/login')
        .send({username: 'test', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const token = login.body.token;
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(initBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const login2 = await api
        .post('/api/login')
        .send({username: 'test2', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const token2 = login2.body.token;
        const deleteResponse = await api
            .delete(`/api/blogs/${response.body.id}`)
            .set('Authorization', `Bearer ${token2}`)
            .expect(404)

        assert.strictEqual(deleteResponse.body.error, 'only creator can delete this blog')
    })

    test('delete blog by without token should fail', async () => {
        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const login = await api
        .post('/api/login')
        .send({username: 'test', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const token = login.body.token;
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(initBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const deleteResponse = await api
            .delete(`/api/blogs/${response.body.id}`)
            .expect(401)

        assert.strictEqual(deleteResponse.body.error, 'token missing or invalid')
    })


    test('testing to update blog', async () => {
        const initBlog = {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }

        const login = await api
        .post('/api/login')
        .send({username: 'test', password: 'secret'})
        .expect(200)
        .expect('Content-Type', /application\/json/);
        const token = login.body.token;

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(initBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const newBlog = await Blog.findById(response.body.id).exec();
        assert.strictEqual(newBlog.title, initBlog.title)

        const changedBlog = {
            title: "New Title",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
        }  

        const updatedResponse = await api
            .put(`/api/blogs/${response.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(changedBlog)
            .expect(200)

        const updatedBlog = await Blog.findById(updatedResponse.body.id).exec();
        assert.strictEqual(updatedBlog.title, "New Title")
    })

    after(async () =>  {
        await mongoose.connection.close()
    })
})
