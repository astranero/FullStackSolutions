const { test, expect, describe, beforeEach, afterAll } = require('@playwright/test')

const baseUrl = 'http://localhost:5173'
const resetUrl = 'http://localhost:3003/api/testing/reset'
const usersUrl = 'http://localhost:3003/api/users'

describe('Blog App E2E', () => {
    beforeEach(async ({ page, request }) => {
        test.setTimeout(30000)
        await request.post(resetUrl)
        await request.post(usersUrl, {
            data: { name: 'Test User', username: 'test', password: 'test' }
        })

        await request.post(usersUrl, {
            data: { name: 'Test User2', username: 'test2', password: 'test' }
        })
        await page.goto(baseUrl)
    })

    test('login form is displayed', async ({ page }) => {
        await expect(page.getByText('log in to application')).toBeVisible()
    })

    test('login with correct credentials', async ({ page }) => {
        await page.locator('#username').fill('test')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('login fails with wrong credentials', async ({ page }) => {
        await page.locator('#username').fill('test')
        await page.locator('#password').fill('fail')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('wrong credentials')).toBeVisible()
    })

    test('user can create a blog', async ({ page }) => {
        await page.locator('#username').fill('test')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.locator('#title').fill('Test title')
        await page.locator('#author').fill('Test author')
        await page.locator('#url').fill('http://test.com')
        await page.getByRole('button', { name: 'create' }).click()

        await expect(
            page.getByRole('paragraph').filter({ hasText: 'Test title' })
        ).toBeVisible()
    })

    test('user can like a blog', async ({ page }) => {
        await page.locator('#username').fill('test')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.locator('#title').fill('Test title')
        await page.locator('#author').fill('Test author')
        await page.locator('#url').fill('http://test.com')
        await page.getByRole('button', { name: 'create' }).click()

        const blog = page.locator('.blog').filter({ hasText: 'Test title' }).first()
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByText('likes 0')).toBeVisible()

        await blog.getByRole('button', { name: 'like' }).scrollIntoViewIfNeeded()
        await blog.getByRole('button', { name: 'like' }).click({ force: true })

        await page.reload()

        const blogSec = page.locator('.blog').filter({ hasText: 'Test title' }).first()
        await blogSec.getByRole('button', { name: 'view' }).click()
        await expect(blogSec.getByText('likes 1')).toBeVisible()
    })

    test('creator can delete a blog', async ({ page }) => {
        await page.locator('#username').fill('test')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.locator('#title').fill('Test delete title')
        await page.locator('#author').fill('Test author')
        await page.locator('#url').fill('http://test.com')
        await page.getByRole('button', { name: 'create' }).click()

        await page.getByRole('button', { name: 'view' }).click()

        page.once('dialog', async dialog => {
            await dialog.accept()
        })

        page.getByRole('button', { name: 'delete' }).click()
        await page.waitForTimeout(1000)

        await expect(
            page.getByRole('paragraph').filter({ hasText: 'Test delete title' })
        ).not.toBeVisible()
    })

    test('blogs are sorted by likes', async ({ page }) => {
        await page.goto(baseUrl)
        test.setTimeout(15000)

        await page.locator('#username').fill('test')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        await expect(page.getByText('Test User logged in')).toBeVisible()

        const blogs = [
            { title: 'Least liked blog', author: 'Test', url: 'http://test.com' },
            { title: 'Medium liked blog', author: 'Test', url: 'http://test.com' },
            { title: 'Highest liked blog', author: 'Test', url: 'http://test.com' }
        ]

        for (const blog of blogs) {
            await page.getByRole('button', { name: 'new blog' }).click()
            await page.locator('#title').fill(blog.title)
            await page.locator('#author').fill(blog.author)
            await page.locator('#url').fill(blog.url)
            await page.getByRole('button', { name: 'create' }).click()
            await expect(page.getByText(blog.title).first()).toBeVisible()
        }

        async function likeBlog(title, times) {
            for (let i = 0; i <= times; i++) {
                const blog = page.locator('.blog').filter({ hasText: title }).first()
                await blog.getByRole('button', { name: 'view' }).click()
                await blog.getByRole('button', { name: 'like' }).click({ force: true })
                await page.waitForTimeout(500)
                await page.reload()
            }
        }

        await likeBlog('Least liked blog', 1)
        await likeBlog('Highest liked blog', 3)
        await likeBlog('Medium liked blog', 2)
        await page.reload()
        await page.waitForTimeout(500)

        const blogTitles = await page.locator('.blog p:first-child').allTextContents()
        const unique = [...new Set(blogTitles)]
        expect(unique).toEqual([
            'Highest liked blog',
            'Medium liked blog',
            'Least liked blog'
        ])
    })

    test('another user cannot see delete button', async ({ page }) => {
        await page.locator('#username').fill('test')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        await page.getByRole('button', { name: 'new blog' }).click()
        await page.locator('#title').fill('Test delete title')
        await page.locator('#author').fill('Test author')
        await page.locator('#url').fill('http://test.com')
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByRole('paragraph').filter({ hasText: 'Test delete title' })).toBeVisible()

        await page.getByRole('button', { name: 'logout' }).click()
        await expect(page.getByText('log in to application')).toBeVisible()

        await page.locator('#username').fill('test2')
        await page.locator('#password').fill('test')
        await page.getByRole('button', { name: 'login' }).click()

        const secondUserBlog = page.locator('.blog').filter({ hasText: 'Test delete title' }).first()
        await secondUserBlog.getByRole('button', { name: 'view' }).click()
        await expect(secondUserBlog.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })

    afterAll( async({ request }) => {
        await request.post(resetUrl)
    })
})
