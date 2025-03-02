import { useDispatch } from 'react-redux'
import { createAnectode } from '../reducers/anecdoteReducer'


const AnectodeForm = () => {
    const dispatch = useDispatch()

    const addAdnectode = (event) => {
        event.preventDefault()
        dispatch(createAnectode(event.target.anectode.value))
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAdnectode}>
                <div><input name='anectode'/></div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnectodeForm
