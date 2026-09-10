import { io } from "socket.io-client";

const SOCKET_URL =
    "https://devchat-production-184b.up.railway.app";
const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket"],
});

export default socket;