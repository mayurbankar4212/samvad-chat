
import http from 'http';
import { Server } from 'socket.io';

function socketHandler(): void {
    const server = http.createServer();
    const io = new Server(server, {
        cors: {
            origin: '*'
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Listen for 'user join' event to receive the user's name
        socket.on('user join', (username: string) => {
            // Emit 'user joined' event to all connected clients with the user's name
            io.emit('user joined', `${username} joined the chat`);
        });

        socket.on('chat message', (message: string) => {
            // Broadcast the 'chat message' to all connected clients except the sender
            socket.broadcast.emit('chat message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    const port = 3000;
    server.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

export default socketHandler;
