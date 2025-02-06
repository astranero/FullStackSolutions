const mongoose = require('mongoose')
require('dotenv').config()

const username = process.env.MONGO_USERNAME
const password = process.argv[2] || process.env.MONGO_PASSWORD

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
  console.log(`${username}@${password}`)
})

const url = `mongodb+srv://${username}:${password}@cluster0.jqrp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then((result) => {
    console.log(
      `Added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    )
    mongoose.connection.close()
  })
}

if (!process.argv[3] && !process.argv[4]) {
  Person.find({}).then((persons) => {
    console.log('phonebook:')
    persons.map((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
