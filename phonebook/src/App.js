import { useState, useEffect } from 'react'
import React from 'react'
import personService from './services/persons'
import './index.css'

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

const Persons = ({persons, showFiltered, deletePerson}) => {
	return (
		<ul>
		  {persons.filter(person => person.name.toLowerCase().includes(showFiltered.toLowerCase()))
		  .map((person, id) =>
      <li className='person' key={id}>{person.name} -- {person.number}<button onClick={() => deletePerson(person.id)}>delete</button></li>
)}
	  </ul>
	)
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showFiltered, setShowFiltered] = useState('')

  useEffect(() => {
	  personService
	  	.getAll()
		  .then(initialPersons => setPersons(initialPersons))
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
  const toUpdate = persons.find(person => person.name === newName)
	if (toUpdate){
    if (window.confirm(`Update contact information of ${toUpdate.name}?`)){
      personService
        .update(toUpdate.id, {...toUpdate, number: newNumber})
        .then(returnedPerson => {setPersons(persons.map(p => p.id !== toUpdate.id ? p : returnedPerson))})
    }}
  else
  {
    setPersons(persons.concat({name: newName, number: newNumber}))
    personService
    .create({name: newName, number: newNumber})
      .then(returnedPerson => setPersons(persons.concat(returnedPerson)))
  }
	  setNewName('')
	  setNewNumber('')
  }

  const deleteContact = id => {
    personService.remove(id)
    .then(
      personService.getAll()
      .then(pers => setPersons(pers))
    )
  }

  return (
    <div>
    	<h2>Phonebook</h2>
		<Filter showFiltered={showFiltered} handleFilterChange={handleFilterChange} />
		<h3>add new contact</h3>
		<PersonForm onSubmit={addContact} newName={newName} handleNameChange={handleNameChange}
			newNumber={newNumber} handleNumberChange={handleNumberChange}/>
		<h2>Numbers</h2>
		<Persons persons={persons} showFiltered={showFiltered} deletePerson={deleteContact}/>
    </div>
  )
}

export default App