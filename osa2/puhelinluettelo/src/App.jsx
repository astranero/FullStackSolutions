import { useState } from 'react'

const Number = ({name, number}) => {
  return (
    <p> {name} {number} </p>
  )
}

const Header = ({text}) => {
  return (
    <h2>  {text} </h2>
  )
}

const Value = ({value, onChange, text}) => {
  return (
    <div>
      {text}: <input value={value} onChange={onChange} /> 
    </div>
  )
}

const Persons = ({filteredPersons}) => {
  return  filteredPersons.map(
    (person) => <Number key={person.name} name={person.name} number={person.number}/>
     )
}

const PersonForm = ({onSubmit, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <Value value={newName} onChange={handleNameChange} text={"value"} />
      <Value value={newNumber} onChange={handleNumberChange} text={"phone"} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  
  const [persons, setPersons] = useState([
      { name: 'Arto Hellas', number: '040-123456' },
      { name: 'Ada Lovelace', number: '39-44-5323523' },
      { name: 'Dan Abramov', number: '12-43-234345' },
      { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
  

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState()
  const [filteredPersons, setfilteredPersons] = useState([...persons])

  const addName = (event) => {
    event.preventDefault()
    const currentPersons = [...persons]
    const nameExists = currentPersons.some( person => {return person.name == newName})

    if (nameExists) {
      alert(`${newName} is already added to phonebook`)
    } else {
      currentPersons.push({name: newName, number: newNumber})
      const filteredPersons = currentPersons.filter((person) => person.name.includes(filter))
      setfilteredPersons(filteredPersons) 
      setPersons(currentPersons)
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const filterValue = event.target.value
    setNewFilter(filterValue)

    const currentPersons = [...persons]
    const filteredPersons = currentPersons.filter((person) => person.name.includes(filter))
    setfilteredPersons(filteredPersons) 
  }

  return (
    <div>
      <Header text={"Phonebook"} />
      <Value value={filter} onChange={handleFilterChange} text={"filter shown with"}/>
      <Header text={"Add a new"} />
      <PersonForm onSubmit={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <Header text={"Numbers"} />
      <Persons filteredPersons={filteredPersons} />
      ...
    </div>
  )
}

export default App