const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    {
        title: "testi blogi",
        author: "v",
        url: "localhost",
        likes: 8,
        id: "6912720d09c9b1e275afc8b7"
    },
    {
        title: "toinen blogi",
        author: "v",
        url: "localhost",
        likes: 5,
        id: "69127af7dc4757e538a7fa10"
    },
    {
        title: "paras blogi",
        author: "v",
        url: "localhost",
        likes: 12,
        id: "69127be7dc4757e538a7fa11"
    }
];

test('dummy returns one', () => {
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes tests', () => {
    test('currect number of total likes from the blogs array from the totalLikes function', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 25)
    })
})

describe('favorite blog tests', () => {
    test('favoriteBlog returns the blog with most likes', () => {
        const result = listHelper.favoriteBlog(blogs);

        assert.deepStrictEqual(result, {
            title: "paras blogi",
            author: "v",
            url: "localhost",
            likes: 12,
            id: "69127be7dc4757e538a7fa11"
        });
    });

    test('favoriteBlog returns null for empty list', () => {
        const result = listHelper.favoriteBlog([]);
        assert.strictEqual(result, null);
    });
})