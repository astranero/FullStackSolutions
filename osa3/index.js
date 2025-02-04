console.log('Hello world!')

const express = require("express")
const cors = require("cors")
const app = express()
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3001;
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



let notes = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary",
        number: "39-23-6423122"
    }
]


app.get(`/`, (request, response) => {
    response.send("<h1>Hello World!</h1>")
})

app.get("/info", (request, response) => {
    const time = new Date().toString();
    response.send(`
            <p>Phonebook has info for ${notes.length} people</p>
            <p>${time}</p>`
    )
    console.log(request)
    response.end()
})

app.get(`/api/persons`, (request, response) => {
    response.json(notes)
})


app.get(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id);
    note = notes.find((note) => note.id == id)
    if (note){
        response.status(200).json(note)
    } else {
        response.status(404).send({error: "Note not found"})
    }
})


app.delete(`/api/persons/:id`, (request, response) => {
    const id = Number(request.params.id);
    startLen = notes.length;
    notes = notes.filter((note) => note.id != id)
    if (notes.length < startLen){
        response.status(204).end()
    } else {
        response.status(404).send({error: "Note not found"})
    }
})

app.post(`/api/persons/`, (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(404).json({error: "Name and number are required."});
    }

    console.log(name, number)
    const id = Math.floor(Math.random() * (64000 -1) + 1);
    startLen = notes.length;

    const data = { 
        "id": id,
        "name": name, 
        "number": number
    }

    const note = notes.find((note) => note.name == name);
    if (note) {
        return response.status(404).json({error: "Name must be unique"});
    }

    notes.push(data)
    return response.status(201).json(data);
})


app.put(`/api/persons/:id`, (request, response) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(404).json({error: "Name and number are required."});
    }

    console.log(name, number)
    const id = Math.floor(Math.random() * (64000 -1) + 1);
    startLen = notes.length;

    const data = { 
        "id": id,
        "name": name, 
        "number": number
    }

    const note = notes.find((note) => note.name === name);
    if (!note) {
        return response.status(404).json({error: "Person not found."});
    }

    notes = notes.map((note) => note.id === data.id ? {...note, "name": name, "number": number}: note)
    return response.status(201).json(data);
})

PORT = port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})   
