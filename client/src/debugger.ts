import { API_ACTIVE_SESSIONS, DataPacket } from "./DataPacket";

const socket = new WebSocket('ws://localhost:{PORT}');

// Connection opened
socket.addEventListener('open', (event) => {
    
});

// Listen for messages
socket.addEventListener('message', (event) => {
    try {
        const dataPacket: DataPacket = JSON.parse(event.data);
        switch (dataPacket.api) {
            case API_ACTIVE_SESSIONS:
                console.log(dataPacket.data);
                break;
        }
    } catch (error) {
        console.log(error);
    }
});

