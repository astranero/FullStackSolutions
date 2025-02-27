import Input from '../components/Input'

const Login = ({ changeHandler, submitHandler }) => (
    <>
        <Input.InputSection title="log in to application" onSubmit={submitHandler}>
            <Input.InputBox title="username" name="username" id="username" changeHandler={ changeHandler }></Input.InputBox>
            <Input.InputBox title="password" name="password" id="password" changeHandler={ changeHandler }></Input.InputBox>
            <Input.SubmitButton value="login" submitHandler={ submitHandler } />
        </Input.InputSection>
    </>
)

export default Login
