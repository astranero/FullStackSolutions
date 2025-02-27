import Input from '../components/Input'
import BlogService from '../services/blogs'
import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Toggleable'

let name = window.localStorage.getItem('name')

const Blogs = ({ blogs, setBlogs, setError, setMessage }) => {
    const handleLike = async (blog) => {
        try {
            const updatedBlog = {
                ...blog,
                likes: blog.likes + 1,
                user: blog.user.id
            }
            const returnedBlog = await BlogService.update(blog.id, updatedBlog)
            setBlogs((prev) =>
                prev.map((b) => (b.id === blog.id ? returnedBlog : b))
            )
        } catch (error){
            setError(error.message)
            setTimeout(() => setError(null), null)
        }

    }

    const handleDelete = async (blog) => {
        console.log(blog)
        try {
            await BlogService.deleteBlog(blog.id, blog)
            setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
            setTimeout(() => setMessage(null), 5000)
        } catch (error) {
            setError(error.message)
            setTimeout(() => setError(null), 5000)
        }
    }

    return (
        <>
            <h1>blogs</h1>
            <p>{name} logged in <Input.SubmitButton value='logout' submitHandler={
                () => {
                    window.localStorage.clear()
                    window.location.reload()
                }}/></p>
            <Togglable buttonLabel="new blog">
                <BlogForm setError={setError} setMessage={setMessage} createBlog={BlogService.create}></BlogForm>
            </Togglable>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} handleLike={() => handleLike(blog)} handleDelete={() => handleDelete(blog) }/>
            )}
        </>
)}

export default Blogs
