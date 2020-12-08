import html2canvas from 'html2canvas';
import { ClientLogsHandler } from "./ClientLogsHandler";
import { API_PING_SESSION, API_START_SESSION, API_SYNC_FRAME, DataPacket } from "./DataPacket";

const maintainSession = (webSocket: WebSocket) => {
    try {
        const dataPacket: DataPacket = {
            api: API_PING_SESSION,
            data: {
                // @ts-ignore
                sessionId: window.__web_debugger__.sessionId
            }
        }
        webSocket.send(JSON.stringify(dataPacket));
        setTimeout(() => {
            maintainSession(webSocket);
        }, 5000);
    } catch (error) {
        console.log(error);
    }
}

const getFrame = (fps: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const canvas: HTMLCanvasElement = await html2canvas(document.body);
            resolve(canvas.toDataURL());
        } catch (error) {
            reject(error);
        }
    });
}

const syncFrame = (fps: number, webSocket: WebSocket) => {
    try {
        html2canvas(document.body)
            .then((canvas: HTMLCanvasElement) => {
                const frame = canvas.toDataURL();
                // get the frame here
                const dataPacket: DataPacket = {
                    api: API_SYNC_FRAME,
                    data: {
                        // @ts-ignore
                        sessionId: window.__web_debugger__.sessionId,
                        frame: frame
                    }
                }
                webSocket.send(JSON.stringify(dataPacket));
            }).catch(error => {
                console.log(error);
            });
        setTimeout(() => {
            syncFrame(fps, webSocket);
        }, 1000 / fps);
    } catch (error) {
        console.log(error);
    }
}

// @ts-ignore
if (!window.__web_debugger__) {
    // @ts-ignore
    window.__web_debugger__ = {
        exists: true
    };


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
                    // @ts-ignore
                    window.__web_debugger__ = {
                        sessionId: dataPacket.data.sessionId
                    }
                    maintainSession(socket);
                    syncFrame(25, socket);
                    clientLogsHandler.start();
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    });


}