import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new SocketIO(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Volunteer real-time broadcast (no DB persistence)
    socket.on('volunteer_requested', (payload) => {
        const { name, phone, description } = payload;
        socket.broadcast.emit('volunteer_alert', { name, phone, description });
    });

    socket.on('disconnect', () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

// ── CORS ──────────────────────────────────────────────────────────────────────
// Allow Vite dev server (5173) and any local production build
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'backend', port: process.env.PORT || 5001 });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/hospitals', hospitalRoutes);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
