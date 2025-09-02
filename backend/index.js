require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

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

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformated id' })
    }

    next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqBody'))

app.get('/', (request, response) => {
    response.send('toto')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) =>{
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.get('/info', (request, response) => {
    const entries = persons.length
    const now = new Date()

    response.send(`
        <p>Phonebook has info for ${entries} people</p>
        <p>${now}</p>
    `)
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(res => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    }

/*     if (persons.some(pers => pers.name === body.name)) {
        return res.status(400).json({
            error: 'duplicate name'
        })
    }

    if (persons.some(p => p.id === id)) {
        return res.status(400).json({
            error: 'incorrect id'
        })
    } */

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
