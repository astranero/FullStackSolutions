import { render, screen } from '@testing-library/react'
import Blog from '../src/components/Blog'
import BlogForm from '../src/components/BlogForm'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Bob',
        url: 'www.localhost.com'
    }

    render(<Blog blog={blog} />)

    const elements = screen.getAllByText('Component testing is done with react-testing-library')
    const visibleElement = elements.find(el => window.getComputedStyle(el).display !== 'none')
    expect(visibleElement).toBeDefined()
    const elementsAuthor = screen.getAllByText('Bob')
    const visibleElementAuthor = elements.find(el => window.getComputedStyle(el).display !== 'none')
    expect(visibleElementAuthor).toBeDefined()
})


test('blog details are shown when the view button is clicked', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Bob',
        url: 'www.localhost.com'
    }

    render(<Blog blog={blog}/>)
    const viewButton = screen.getByText('view')
    expect(viewButton).toBeDefined()

    const user = userEvent.setup()
    await user.click(viewButton)

    const hideButton = screen.getByText('hide')
    expect(hideButton).toBeVisible()

    const urlElement = screen.getByText('www.localhost.com')
    expect(urlElement).toBeVisible()
})


test('test clicking like button twice calls twice', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Bob',
        url: 'www.localhost.com'
    }

    const mockHandler = vi.fn()

    render(<Blog blog={blog} handleLike={mockHandler} />)
    const likeButton = screen.getByText('like')
    expect(likeButton).toBeDefined()

    const user = userEvent.setup()
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler).toHaveBeenCalledTimes(2)
})


test('submit blogForm with correct data', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Bob',
        url: 'www.localhost.com'
    }

    const mockCreateBlog = vi.fn()
    const setError = vi.fn()
    const setMessage = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} setError={setError} setMessage={setMessage}/>)

    const user = userEvent.setup()
    const titleInput = screen.getByRole('textbox', { name: /title/i })
    const authorInput = screen.getByRole('textbox', { name: /author/i })
    const urlInput = screen.getByRole('textbox', { name: /url/i })
    
    await user.click(titleInput)
    await user.type(titleInput, 'Component testing is done with react-testing-library')

    await user.click(authorInput)
    await user.type(authorInput, 'Bob')

    await user.click(urlInput)
    await user.type(urlInput, 'www.localhost.com')

    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
        title: 'Component testing is done with react-testing-library',
        author: 'Bob',
        url: 'www.localhost.com'
    })
})
