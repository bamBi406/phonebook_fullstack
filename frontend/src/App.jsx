import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import ShowPersons from './components/ShowPersons'
import PersonForm from './components/PersonForm'
import NotificationMessage from './components/Notifications'
import ErrorMessage from './components/Errors'

import personsService from './services/persons'


const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [newNotification, setNewNotification] = useState(null)
  const [newError, setNewError] = useState(null)

  console.log('persons is', persons)

  useEffect(() => {
    personsService
      .getAll()
      .then(r => setPersons(r))
  }, [])

const addName = (event) => {
  event.preventDefault()

  const existingPerson = persons.find(
    p => p.name.toLocaleLowerCase() === newName.toLocaleLowerCase()
  )

  if (existingPerson) {
    if (existingPerson.number === newNumber) {
      setNewError(
        `${newName} is already in the Numberbook with this number`
      )
      setTimeout(() => {
        setNewError(null)
      }, 4000)
      return
    }

    const changedPerson = { ...existingPerson, number: newNumber }

    if (window.confirm(`Update ${newName}'s number`)) {
      personsService
        .update(existingPerson.id, changedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(
            p => p.id === existingPerson.id ? returnedPerson : p
          ))
          setNewNotification(
            `${newName}'s number updated`
          )
          setTimeout(() => {
            setNewNotification(null)
          }, 3000)
        })
        .catch(error => {
          console.log(error)
          setNewError(
            `Information of ${newName} has already been removed from server`
          )
          setTimeout(() => {
            setNewError(null)
          }, 3000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }

  } else {
    personsService
      .create({ name: newName, number: newNumber })
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setNewNotification(
          `Added ${newName}`
        )
        setTimeout(() => {
          setNewNotification(null)
        }, 3000)
      })
      .catch(error => {
        console.error(error)
        setNewError(
            `${error.response.data.error}`
          )
          setTimeout(() => {
            setNewError(null)
          }, 3000)
      })
  }
}

  const handleChangeName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFindName = (event) => {
    setFilterName(event.target.value)
  }

  const deleteSelectedPerson = (id) => {
    const person = persons.find(p => p.id === id)
    const name = person.name

    if (window.confirm(`Delete ${name} ?`)) {
      personsService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setNewNotification(`Deleted ${name}`)
          setTimeout(() => {
            setNewNotification(null)
          }, 3000)
        })
        .catch(error => {
          console.log(error)
          setNewError(`${name} was already removed from server`)
          setTimeout(() => {
            setNewError(null)
          }, 3000)
          setPersons(persons.filter(p => p.id !== id))
        })

    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <NotificationMessage message={newNotification} />
      <ErrorMessage message={newError} />
      <Filter filterName={filterName} handleFindName={handleFindName} />
      <h2>Add a new number</h2>
      <PersonForm 
        newName={newName} 
        handleChangeName={handleChangeName}
        addName={addName}
        newNumber={newNumber}
        handleChangeNumber={handleChangeNumber}
      />
      <h2>Numbers</h2>
      <ShowPersons 
        persons={persons} 
        filterName={filterName} 
        deletePerson={deleteSelectedPerson}
      />
    </div>
  )
}

export default App