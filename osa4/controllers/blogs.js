const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken');
const { Blog } = require('../models/blog')
const { SECRET } = require('../utils/config')

blogRouter.get("/", async (request, response) => {
    try {
        result = await Blog.find({}).populate('user', {username: 1, name: 1, _id: 1, id: 1})
        console.log(result)
        response.json(result)
    } catch(e) {
        response.status(400).send(e.message)
    }
})


blogRouter.post("/", async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).json({ error: "title and url are required" });
    }

    if (!request.user){
        return response.status(401).json({error: 'token missing or invalid'})
    }

    const user = request.user
    const body = request.body;

    const blog = new Blog({
        ...body, 
        user: user._id
    });

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    return response.status(201).json(savedBlog)
})


blogRouter.delete("/:id", async (request, response) => {
    if (!request.user){
        return response.status(401).json({error: 'token missing or invalid'})
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog){
        return response.status(404).send('blog not found')
    }

    if (blog.user.toString() !== request.user.id.toString()){
        return response.status(404).json({error: 'only creator can delete this blog'})
    }

    try {
        const result = await Blog.findByIdAndDelete(request.params.id)
        return response.status(204).json(result)
    } catch(e) {
        return response.status(400).json(e.message)
    }
})


blogRouter.put("/:id", async (request, response) => {
    if (!request.user){
        return response.status(401).send('token missing or invalid')
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog){
        return response.status(404).send('blog not found')
    }

    if (blog.user.toString() !== request.user.id.toString()){
        return response.status(404).send('only creator can update this blog')
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
                request.params.id, 
                request.body, 
                {new: true}
            )
        return response.status(200).json(updatedBlog)
    } catch(e) {
        return response.status(400).json(e.message)
    }
})


module.exports = { blogRouter };
