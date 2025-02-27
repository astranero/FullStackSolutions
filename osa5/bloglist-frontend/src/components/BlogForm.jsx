import { useState } from 'react'
import Input from '../components/Input'
import PropTypes from 'prop-types'

const BlogForm = ({ setError, setMessage, createBlog }) => {
    const [blogData, setBlogData] = useState({
        title: '' ,
        author: '',
        url: ''
    })

    const changeHandler = e => {
        setBlogData( { ...blogData, [e.target.name]:e.target.value } )
    }

    const submitHandler = e => {
        e.preventDefault ()
        try {
            createBlog(blogData)
            setMessage(`a new blog ${blogData.title} by ${blogData.author} added`)
            window.location.reload()
        } catch (exception){
            setError(true)
            setMessage(exception)
            console.log(exception)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    return (
        <Input.InputSection onSubmit={submitHandler}>
            <h1> create new </h1>
            <Input.InputBox id="title" title="title" name="title" changeHandler={changeHandler} />
            <Input.InputBox id="author" title="author" name="author" changeHandler={changeHandler} />
            <Input.InputBox id="url" title="url" name="url" changeHandler={changeHandler} />
            <Input.SubmitButton value='create' submitHandler={submitHandler}/>
        </Input.InputSection>
    )
}

BlogForm.propTypes = {
    setError: PropTypes.func.isRequired,
    setMessage: PropTypes.func.isRequired,
    createBlog: PropTypes.func.isRequired
}

export default BlogForm
