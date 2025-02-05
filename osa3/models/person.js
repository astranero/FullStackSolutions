const mongoose = require('mongoose');
require('dotenv').config();

const username =  process.env.MONGO_USERNAME
const cluster = process.env.MONGO_CLUSTER
const password = process.argv[2] || process.env.MONGO_PASSWORD

process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
    console.log(`${username}@${password}`)
})


const url = `mongodb+srv://${username}:${password}@${cluster}`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


personSchema.set(`toJSON`, {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})


personSchema.static(`readPersons`,
function () {
    return Person.find({})
        .then(persons => {
            console.log(`Persons:`, persons)
            return persons
        })
        .catch( error => {
            console.error(`Error read failed:`, error)
            throw error
        })
})


personSchema.static(`addPerson`,
function (personData) {
    const newPerson = new Person({
        "name": personData.name,
        "number": personData.number
    })

    return newPerson.save().then( addedPerson => {
        console.log(`Added ${addedPerson.name} number ${addedPerson.number} to phonebook`)
        return addedPerson
    })
    .catch(error => {
        console.error(`Error failed adding new Person:`, error)
        throw error
    })
})


personSchema.static(`deletePerson`,
function (id) {
    return Person.findByIdAndDelete(id)
        .then( deletedPerson => {
            if (deletedPerson){
                console.log(`Deleted ${deletedPerson.name} number ${deletedPerson.number} from phonebook`)
                return deletedPerson
            } else {
                console.log(`No person found with the given id.`)
            }
        })
        .catch(error => {
            console.error("Delete failed:", error)
            throw error
        })
})


personSchema.static(`updatePerson`, 
function (personData) {
    return Person.findByIdAndUpdate({_id: personData.id}, personData, {new: true}).then( updatedPerson => {
            console.log(`Updated document:`, updatedPerson)
            return updatedPerson
        })
        .catch(error => {
            console.error("Update failed:", error)
            throw error
        })
})


personSchema.static(`getById`, 
function (id) {
    return Person.findById(id).then( thePerson => {
            console.log(`Fetched document:`, thePerson)
            return thePerson
        })
        .catch(error => {
            console.error("Failed Get by Id:", error)
            throw error
        })
})


const Person = mongoose.model('Person', personSchema);
module.exports = Person;
