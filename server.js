import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import { randomInt } from 'crypto';

const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())

app.get("/ids", (req, res) => {
    const uuid = uuidv4()
    return res.status(200).json( {"id" : uuid} )
})

app.get('/users', (req, res) => {
    const users = JSON.parse(fs.readFileSync('users.json', { encoding: 'utf8' }))
    const id = req.query.id
    
    if (id === '*') {
        return res.status(200).json( users )
    }

    const user = users.find(user => user.id === id)
    if (user) {
        return res.status(200).json(user)
    }
    return res.status(404).json("User not found")
})

app.post('/users', (req, res) => {
    const body = req.body

    body['id'] = uuidv4()
    const data = JSON.parse(fs.readFileSync('users.json', { encoding: 'utf8' }))
    data.push(body)

    // Implement 50% failure rate
    if (randomInt(9) < 5) {
        fs.writeFileSync('users.json', JSON.stringify(data), 'utf8')
        return res.status(201).json("Resource created successfully")
    }
    return res.status(500).json("An unexpected error occurred while processing your request.")
})
const server = app.listen(PORT, ()=> console.log("Server running on Port 3000"))
export { server }