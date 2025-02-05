import { useState, useEffect } from 'react'
import personService from './services/persons.jsx'
import { Header, Value, Persons, PersonForm } from './components/persons';

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  const notStyle = {
    color: 'green',
    background: 'lightgrey',
    fontStyle: 'italic',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={notStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setNewFilter] = useState('')
  const [persons, setPersons] = useState([])
  const [filteredPersons, setFilteredPersons] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService.getAll()
    .then(response => {
      const currentPersons = response.data;
      setPersons(currentPersons);
      setFilteredPersons(currentPersons.filter(p => p.name.toLowerCase().includes(filter || "")));
    })
    .catch(e => { 
      setErrorMessage(`Error: ${e.message} `)
      setTimeout(() =>  {
        setErrorMessage(null)
      }, 5000)
    })
  }, [])

  const addName = (event) => {
    event.preventDefault();
    const currentPersons = [...persons];
    const nameExists = currentPersons.some( p => {return p.name === newName});
    const newObj = {
      name: newName,
      number: newNumber
    };

    if (nameExists) {
      const person = currentPersons.filter(p => p.name === newName)[0]
      if (window.confirm(`${newName} is already added to phonebook. Do you want to update the number?`)){
        person.number = newNumber
        personService.update(person).then(
          UpdatedPerson => {
            setPersons(persons.map(p => (p.id === UpdatedPerson.id ? UpdatedPerson : p)));
            setFilteredPersons(filteredPersons.map(p => (p.id === UpdatedPerson.id ? UpdatedPerson: p )));
            setMessage(`Updated ${newName}`);
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName("");
            setNewNumber("");
          }
        ).catch(e => {
          setErrorMessage(`Error: ${newName} was already removed from the server`);
          setPersons(persons.filter(p => p.id !== person.id));
          setFilteredPersons(filteredPersons.filter(p => p.id !== person.id));
          setTimeout(() =>  {
            setErrorMessage(null)
          }, 5000)
        });
      }
    } else {
      personService.create(newObj)
      .then(createdPerson => {
          setPersons([...persons, createdPerson]);
          setFilteredPersons([...filteredPersons, createdPerson]);
          setMessage(`Created ${newName}`);
          setTimeout(() => {
            setMessage(null)
          }, 5000);
          setNewName("");
          setNewNumber("");
        }
      ).catch(e => {
        setErrorMessage(`Error: ${e.message} `)
        setTimeout(() =>  {
          setErrorMessage(null)
        }, 5000)
      })
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
    const person = persons.find(p => p.id === id);
    if (!person) return;

    personService.deletePerson(id).then(() => {
      setPersons(persons.filter(p => p.id !== id));
      setFilteredPersons(filteredPersons.filter(p => p.id !== id));
      setMessage(`Deleted ${person.name}`);
      setTimeout(() => {
        setMessage(null)
      }, 5000);
      setNewName("");
    }).catch(e => {
      setErrorMessage(`Error: ${e.message} `)
      setTimeout(() =>  {
        setErrorMessage(null)
      }, 5000)
    });

  }

  return (
    <div>
      <Error message={errorMessage} />
      <Notification message={message} />
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
