import { useState } from 'react'

const Togglable = ({ children, buttonLabel }) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
    setVisible(!visible)
    }

    return (
        <>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {children}
                <br/>
                <button onClick={toggleVisibility}>cancel</button>
                <br/>
                <br/>
            </div>
        </>
    )
}

export default Togglable
