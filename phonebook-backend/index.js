const { json } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')


app.use(express.json())

morgan.token('my-log', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :my-log'))

let contacts = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/contacts', (request, response) => {
  response.send(contacts)
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<div>
  <p>Phonebook has info for ${contacts.length} people</p
  <p>${date}</p>
  </div>`)
})

app.get('/api/contacts/:id', (request, response) => {
  const id = parseInt(request.params.id)
  const contact = contacts.find(contact => contact.id === id)
  response.send(contact)
})

app.delete('/api/contacts/:id', (request, response) => {
  const id = parseInt(request.params.id)
  contacts = contacts.filter(contact => contact.id !== id)
  response.status(204).end()
})

const getRandomId = () => Math.floor(Math.random() * 500000)

app.post('/api/contacts', (request, response) => {
  const body = request.body
  if (!body.name){
    return response.status(400).json({
      error:"Name parameter is required"
    })
  }
  if (contacts.find(contact => contact.name === body.name)){
    return response.status(400).json({
      error: "Contact is already present in the phonebook"
    })
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: getRandomId()
  }
  contacts = contacts.concat(contact)
  response.send(contact)

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001

app.listen(PORT)
console.log(`Listening to port '${PORT}'`)