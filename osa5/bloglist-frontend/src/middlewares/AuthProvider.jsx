import { useState, useEffect } from 'react'
import Login from '../pages/Login'
import LoginService from '../services/login'
import blogService from '../services/blogs'

const Auth = ( { children, setBlogs, setError, setMessage } ) => {
    const [loginData, setLoginData] = useState({
        username: '' ,
        password: ''
    })

    const changeHandler = e => {
        setLoginData( { ...loginData, [e.target.name]:e.target.value } )
    }

    const submitHandler = e => {
        e.preventDefault ()
        LoginService.handleLogin(e, loginData.username, loginData.password, setMessage, setError)
    }

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [setBlogs])

    const user = window.localStorage.getItem('username')
    console.log(user)
    if (user === null){
        return (
            <Login changeHandler={changeHandler} submitHandler={submitHandler}></Login>
        )
    } else {
        return children
    }

}

export default Auth
