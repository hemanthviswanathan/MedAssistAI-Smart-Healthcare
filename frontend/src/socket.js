/**
 * socket.js
 * ---------
 * Shared Socket.io-client singleton.
 * Import `socket` anywhere in the app; all components share the same connection.
 */
import { io } from 'socket.io-client';
import { API_BASE_URL } from './config';

const socket = io(API_BASE_URL, {
    autoConnect: true,
    reconnectionAttempts: 5,
});

export default socket;
