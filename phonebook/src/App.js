import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (props) => {
	return (
		<div>
			filter shown with <input  value={props.showFiltered}
			  onChange={props.handleFilterChange}/>
		</div>
	)
}

const PersonForm = (props) => {
	return (
		<form onSubmit={props.onSubmit}>
			<div>
				name: <input value={props.newName}
				onChange={props.handleNameChange}/>
        	</div>
			<div>
				number: <input value={props.newNumber}
				onChange={props.handleNumberChange}/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	)
}

const Persons = ({persons, showFiltered}) => {
	return (
		<ul>
		  {persons.filter(person => person.name.toLowerCase().includes(showFiltered.toLowerCase()))
		  .map((person, id) => <li key={id}>{person.name} -- {person.number}</li>)}
	  </ul>
	)
}

const App = () => {
  const [persons, setPersons] = useState([
    { 
		name: 'Arto Hellas',
		number: 12200441,
	}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')

  useEffect(() => {
	  axios
	  	.get('http://localhost:3001/persons')
		.then(response => setPersons(response.data))
}, [])

  const handleNameChange = (event) => {
	  setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
	  setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
	  setShowFiltered(event.target.value)
  }
  const addContact = (event) => {
	event.preventDefault()
	if (persons.filter(person => person.name === newName).length){
		alert(`${newName} already exists in the list`)
		setNewName('')
		setNewNumber('')
		return
	}
	  setPersons(persons.concat({name: newName, number: newNumber}))
	  setNewName('')
	  setNewNumber('')
  }

  return (
    <div>
    	<h2>Phonebook</h2>
		<Filter showFiltered={showFiltered} handleFilterChange={handleFilterChange} />
		<h3>add new contact</h3>
		<PersonForm onSubmit={addContact} newName={newName} handleNameChange={handleNameChange}
			newNumber={newNumber} handleNumberChange={handleNumberChange}/>
		<h2>Numbers</h2>
		<Persons persons={persons} showFiltered={showFiltered} />
    </div>
  )
}

export default App