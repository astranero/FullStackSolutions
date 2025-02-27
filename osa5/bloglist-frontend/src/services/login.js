import axios from 'axios'
const baseLoginUrl = '/api/login'

const Login = async( { username, password } ) => {
    const credentials = { username: username, password: password }
    const response = await axios.post(baseLoginUrl, credentials)
    console.log(response.data)
    return response.data
}

const handleLogin = async (event, username, password, setMessage, setError) => {
    event.preventDefault()
    try {
        const user = await Login({
            username, password
        })
        window.localStorage.setItem('username', user.username)
        window.localStorage.setItem('token', user.token)
        window.localStorage.setItem('name', user.name)
        window.location.reload()
    } catch (exception) {
        setError(true)
        setMessage('wrong credentials', exception)
        console.log(exception)
        setTimeout(() => {
            setMessage(null)
        }, 5000)
    }

}

export default { handleLogin }
