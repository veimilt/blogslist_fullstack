const blogslistRouter = require('express').Router()
const Blog = require('../models/blog')

blogslistRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogslistRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title or url missing in the request body'
        })
    }
    const blog = new Blog(request.body)

    const result = await blog.save()
    response.status(201).json(result)
})

module.exports = blogslistRouter
