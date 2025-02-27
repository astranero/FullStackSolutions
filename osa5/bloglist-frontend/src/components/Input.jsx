const InputBox = ({ id, title, name, changeHandler }) => (
    <div>
        <label htmlFor={id}> {title} </label>
        <input type="text" id={id} name={name} onChange={changeHandler}/><br/>
        <br/>
    </div>
)

const SubmitButton = ( { value, submitHandler } ) => (
    <>
        <input type="submit" value={value} onClick={submitHandler}/> 
    </>
)

const InputSection = ({ children, title, onSubmit }) => (
    <form onSubmit={onSubmit}>
        <h1>{title}</h1>
        {children}
    </form>
)

export default { InputBox, SubmitButton, InputSection }
