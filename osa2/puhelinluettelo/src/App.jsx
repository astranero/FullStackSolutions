import { useState, useEffect } from 'react'
import personService from './services/persons.jsx'
import { Header, Value, Persons, PersonForm } from './components/persons';

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState()
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState([])

  useEffect(() => {
    personService.getAll().then(response => {
      const currentPersons = response.data
      setPersons(currentPersons)
      const newFilteredPersons = currentPersons.filter(p => p.name.includes(filter))
      setFilteredPersons(response.data)}
    )
    .catch(e => alert("error occured:", e))
    }, [])

  const addName = (event) => {
    event.preventDefault()
    const currentPersons = [...persons]
    const nameExists = currentPersons.some( p => {return p.name === newName})
    const newObj = {
        name: newName,
        number: newNumber
      }

    if (nameExists) {
      const person = currentPersons.filter(p => p.name === newName)[0]
      if (window.confirm(`${newName} is already added to phonebook. Do you want to update the number?`)){
        person.number = newNumber
        personService.update(person).catch(e => alert("error occured", e))
        useEffect()
      }

    } else {
      personService.create(newObj).catch(e => alert("error occured:", e))
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
    const filteredPersons = currentPersons.filter((person) => person.name.includes(filterValue))
    setFilteredPersons(filteredPersons) 
  }

  const handlePersonDelete = (id) => {
    personService.deletePerson(id).catch(e => alert("error occured:", e))

    const newPersons = persons.filter(p => p.id != id)
    setPersons(newPersons)

    const newFilteredPersons = filteredPersons.filter(p => p.id != id)
    setFilteredPersons(newFilteredPersons)
  }

  return (
    <div>
      <Header text={"Phonebook"} />
      <Value value={filter} onChange={handleFilterChange} text={"filter shown with"}/>
      <Header text={"Add a new"} />
      <PersonForm onSubmit={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <Header text={"Numbers"} />
      <Persons persons={filteredPersons} onDelete={handlePersonDelete} />
    </div>
  )
}

export default App
