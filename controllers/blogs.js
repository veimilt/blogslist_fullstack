const blogslistRouter = require('express').Router()
const { request, response, resource } = require('../app')
const Blog = require('../models/blog')
const { error } = require('../utils/logger')

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

blogslistRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
        return response.status(400).end()
    }
    blog.likes = blog.likes + 1
    const result = await blog.save()
    response.json(result)
})

blogslistRouter.delete('/:id', async (request, response) => {
    const id = request.params.id
    if (!id) {
        return response.status(400).json({
            error: 'id missing from the request url'
        })
    }
    const blog = await Blog.findByIdAndDelete(id)
    if (blog) {
        return response.status(204).end()
    } else {
        return response.status(404).end()
    }
})

module.exports = blogslistRouter
