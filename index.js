import express from "express";
import cors from "cors";
import { Server } from 'socket.io'
import http from 'http'
import * as dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(cors())
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
    }
})
io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data)
        console.log(`User with id: ${socket.id} joined room ${data}`)
    })
    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id)
    })

})
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server running at port:${PORT} successfully`)
})