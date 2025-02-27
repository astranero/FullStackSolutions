import { useState } from 'react'
import './Blog.css';

export default function Blog({ blog, handleDelete, handleLike }){
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
      setVisible(!visible)
    }

    return(
      <div className='blog'>
            <div style={hideWhenVisible}>
                <p>{blog.title}</p>
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                <p>{blog.title}</p>
                <button onClick={toggleVisibility}>hide</button>
                <p>{blog.url}</p>
                <p>likes {blog.likes} <button onClick={handleLike}>like</button></p>
                <p>{blog.author}</p>
                {window.localStorage.getItem('username') === blog.user?.username
                ? <button className="blue" onClick={handleDelete}>delete</button>
                : null}
            </div>
      </div>
)}
