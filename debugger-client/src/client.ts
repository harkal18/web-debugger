import { ClientLogsHandler } from "./ClientLogsHandler";
import { API_PING_SESSION, API_START_SESSION, DataPacket } from "./DataPacket";

const maintainSession = (webSocket: WebSocket) => {
    try {
        const win: any = window;
        const dataPacket: DataPacket = {
            api: API_PING_SESSION,
            data: {
                sessionId: win.__web_debugger__.sessionId
            }
        }
        socket.send(JSON.stringify(dataPacket));
        setTimeout(() => {
            maintainSession(webSocket);
        }, 5000);
    } catch (error) {
        console.log(error);
    }
}

const socket = new WebSocket('ws://localhost:{PORT}');
const clientLogsHandler = new ClientLogsHandler(socket);

// Connection opened
socket.addEventListener('open', (event) => {
    const dataPacket: DataPacket = {
        api: API_START_SESSION,
        data: {
            userAgent: navigator.userAgent
        }
    }
    socket.send(JSON.stringify(dataPacket));
});

// Listen for messages
socket.addEventListener('message', (event) => {
    try {
        const dataPacket: DataPacket = JSON.parse(event.data);
        switch (dataPacket.api) {
            case API_START_SESSION:
                console.log(dataPacket.data.sessionId);
                const win: any = window;
                win.__web_debugger__ = {
                    sessionId: dataPacket.data.sessionId
                }
                maintainSession(socket);
                clientLogsHandler.start();
                break;
        }
    } catch (error) {
        console.log(error);
    }
});

