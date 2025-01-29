
export const Number = ({id, name, number, deletePerson}) => {
  return (
    <>
      <p> {name} {number}  <button onClick={deletePerson} style={{color: "red"}}> delete </button> </p>
    </>
  )
}

export const Header = ({text}) => {
  return (
    <h2>  {text} </h2>
  )
}

export const Value = ({value, onChange, text}) => {
  return (
    <div>
      {text}: <input value={value} onChange={onChange} /> 
    </div>
  )
}

export const Persons = ({persons, onDelete}) => {

  return  persons.map(
    (person) => <Number key={person.id} name={person.name} number={person.number} deletePerson={() => onDelete(person.id)}/>
    )
}

export const PersonForm = ({onSubmit, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return (
    <form onSubmit={onSubmit}>
      <Value value={newName} onChange={handleNameChange} text={"name"} />
      <Value value={newNumber} onChange={handleNumberChange} text={"phone"} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}
