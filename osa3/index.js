const express = require("express")
const cors = require("cors")
const path = require("path")
const Person = require('./models/person');

const app = express()


app.use(cors())
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'dist')))

const port = process.env.BACKEND_PORT || 3001;
var morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :note'))

morgan.token('note', (request, response) => { 
    if (request.method == "POST"){
        const name = request.body.name
        const number = request.body.number
        return `{"name": ${name}, "number": ${number}}`
    }
    return '';
})

app.get("/info", (request, response) => {
    const time = new Date().toString();
    response.send(`
            <p>Phonebook has info for Phonebook information of the people</p>
            <p>${time}</p>`
    )
    console.log(request)
    response.end()
})

app.get(`/api/persons`, (request, response) => {
    Person.readPersons()
    .then(result => {
        console.log(`Result:`, result)
        response.json(result)
    })
    .catch( error => {
        console.error(`Failed to read persons:`, error)
        response.status(500).json({ error: 'Internal server error' })
    })

})


app.get(`/api/persons/:id`, (request, response) => {
    const id = request.params.id;
    const person = Person.getById(id)
    .then( person => {
        if (person){
            response.status(200).json(person)
        } else {
            response.status(404).send({person: "Note not found"})
        }
    })
    .catch(error => {
        console.error("Error fetching person:", error)
        response.status(500).json({ error: "Internal server error" })
    })

})

app.delete(`/api/persons/:id`, (request, response) => {
    const id = request.params.id;
    Person.deletePerson(id).then(result => {
        console.log("Deletion success:", result)
        response.status(204).end()
    })
    .catch(error => {
        console.error("Error deleting person by id.", error)
        response.status(500).json({ error: "Internal server error" })
    })
})

app.post(`/api/persons/`, (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({error: "Name and number are required."});
    }

    const personData = { 
        "name": name, 
        "number": number
    }

    Person.addPerson(personData)
    .then(addedPerson => {
        console.log("Person Added successfully.", addedPerson)
        return response.status(201).json(addedPerson);
    })
    .catch(error => {
        console.error("Error adding person:", error)
        response.status(500).json({ error: "Internal server error" })
    })
})


app.put(`/api/persons/:id`, (request, response) => {
    const { name, number } = request.body;
    const id = request.params.id

    if (!name || !number) {
        return response.status(404).json({error: "Name and number are required."});
    }

    const personData = { 
        "id": id,
        "name": name, 
        "number": number
    }

    Person.updatePerson(personData)
    .then(updatedPerson => {
        console.log("Updated person successfully.", updatedPerson)
        return response.status(200).json(updatedPerson);
    })
    .catch(error => {
        console.error("Error updating person:", error)
        response.status(500).json({ error: "Internal server error" })
    })
})


app.get(`*`, (request, response) => {
    response.sendFile(path.resolve(__dirname, 'dist', 'index.html'))
})


PORT = port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})   
