const ShowPersons = ({ persons, filterName, deletePerson }) => {
  const personsToShow = filterName
    ? persons.filter(
      x => x.name.toLocaleLowerCase().startsWith(
        filterName.toLocaleLowerCase()
      )
    )
    : persons

  return personsToShow.map(
    x => (
      <p key={x.id}>
        {x.name} {x.number}
        <button onClick={() => deletePerson(x.id)}>
          delete
        </button>
      </p>
    )

  )
}

export default ShowPersons