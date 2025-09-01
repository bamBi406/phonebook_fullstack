const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://antoineesponda_db_user:${password}
@cluster0.i8x7ahb.mongodb.net/Phonebook?
retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {

    const person = new Person({
        name,
        number
    })

    person.save().then(res => {
        console.log(`added ${name} ${number}`)
        mongoose.connection.close()
    })
}

else {
    Person.find({}).then(res => {
        res.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
