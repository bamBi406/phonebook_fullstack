const express = require('express')
const morgan = require('morgan')
const app = express()

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

morgan.token('reqBody', (req) => {
    const body = req.body

    if (!body) {
        return ''
    }

    const bodyContent = {
        name: body.name,
        number: body.number
    }

    return JSON.stringify(bodyContent)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))



const generateId = () => {
    const id = Math.trunc(Math.random()*1000)

    return String(id)
}

let persons = [
    {
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('toto')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (req, res) =>{
    const id = req.params.id
    const person = persons.find(pers => pers.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
    
})

app.get('/info', (request, response) => {
    const entries = persons.length
    const now = new Date()

    response.send(`
        <p>Phonebook has info for ${entries} people</p>
        <p>${now}</p>
    `)
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter( pers => pers.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

    const id = body.id ? body.id : generateId()

    if (persons.some(pers => pers.name === body.name)) {
        return res.status(400).json({
            error: 'duplicate name'
        })
    }

    if (persons.some(p => p.id === id)) {
        return res.status(400).json({
            error: 'incorrect id'
        })
    }

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    res.json(person)
})

app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
