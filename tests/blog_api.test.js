const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const helper = require('./test_helper')
const Blog = require('../models/blog')
const { url } = require('node:inspector')

const api = supertest(app)

const initialBlogs = [
    {
        title: 'blog for testing 1',
        author: "v",
        url: "localhost",
        likes: 6
    },
    {
        title: 'blog for testing 2',
        author: "v",
        url: "localhost",
        likes: 9
    },
]

beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(initialBlogs)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blogs have field id and do not have a field _id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body

    blogs.forEach(blog => {
        assert.ok(blog.id, 'Blog is missing id field')
    })

    blogs.forEach(blog => {
        assert.strictEqual(blog._id, undefined, 'Blog contains _id field')
    })
})

test('post to /api/blogs saves the blog sent to the database', async () => {
    const newBlog = {
        title: 'New test blog made by me',
        author: 'v',
        url: 'http://example.com',
        likes: 7
    }

    const postResponse = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const blogs = await Blog.find({})
    const blogsToJSON = blogs.map(blog => blog.toJSON())

    assert.strictEqual(blogsToJSON.length, initialBlogs.length + 1)

    const contents = blogsToJSON.map(blog => blog.title)
    assert(contents.includes('New test blog made by me'))
})

test('blog sent via post to api/blogs gets 0 likes if likes not defined', async () => {
    const newBlogNoLikes = {
        title: 'New test without likes field',
        author: 'v',
        url: 'http://example.com'
    }

    const postResponse = await api
        .post('/api/blogs')
        .send(newBlogNoLikes)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(postResponse.body.likes, 0)
})

test('blog sent without title or url gets 400 bad request and nothing gets added to the database', async () => {
    const blogNoURL = {
        title: 'New test without likes field',
        author: 'v'
    }

    const blogNoTitle = {
        url: 'localhost',
        author: 'v'
    }

    const postResponseNoURL = await api
        .post('/api/blogs')
        .send(blogNoURL)
        .expect(400)

    const postResponseNoTitle = await api
        .post('/api/blogs')
        .send(blogNoTitle)
        .expect(400)

    const blogsAtEnd = await Blog.find({})
    const blogsToJSON = blogsAtEnd.map(blog => blog.toJSON())

    assert.strictEqual(blogsToJSON.length, initialBlogs.length)
})

after(async () => {
    await mongoose.connection.close()
})