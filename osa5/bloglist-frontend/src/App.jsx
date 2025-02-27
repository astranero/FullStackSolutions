import { useState } from 'react'
import Blogs from './pages/Blogs'
import Auth from './middlewares/AuthProvider'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  return (
    <div>
      <Notification message={message} error={error} />
      <Auth setError={setError} setMessage={setMessage} setBlogs={setBlogs}>
        <Blogs
          blogs={blogs}
          setBlogs={setBlogs}
          setError={setError}
          setMessage={setMessage}
        />
      </Auth>
    </div>
  )
}

export default App
