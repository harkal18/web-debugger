
import * as WebSocket from 'ws';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { API_PING_SESSION, API_START_SESSION, API_SYNC_LOGS, DataPacket } from './DataPacket';
import { Session } from './Session';
import { generateRandomString } from './__utils__';
import { SessionsHandler } from './SessionsHandler';
import { LogsHandler } from './LogsHandler';


export class ClientServerHandler {

    constructor(
        public port: number, 
        public sessionsHandler: SessionsHandler,
        public logsHandler: LogsHandler
    ) {

        const app = express();
        app.use((request, respopnse, next) => {
            const filename = path.basename(request.url);
            if (filename === "__web_debugger_client__.js") {
                fs.readFile(path.join(__dirname, '../client/__web_debugger_client__.js'), "utf8", (error, data) => {
                    if (!error) {
                        const js = data.replace("{PORT}", `${port}`);
                        respopnse.set('content-type', 'text/javascript');
                        respopnse.send(js);
                    }
                });
            } else {
                next();
            }
        });
        app.use(express.static(path.join(__dirname, '../client')));
        // directoryApp.get('/', function (request, response) {
        //     response.send('Hello World');
        // });
        const server = app.listen(port);

        const wss = new WebSocket.Server({ server: server });
        wss.on('connection', (ws: WebSocket) => {
            ws.on('message', async (message: string) => {
                try {
                    const dataPacket: DataPacket = JSON.parse(message);
                    if (dataPacket !== undefined) {
                        switch (dataPacket.api) {
                            case API_START_SESSION:
                                const session: Session | any = {
                                    id: generateRandomString(21),
                                    userAgent: dataPacket.data.userAgent,
                                    time: Date.now(),
                                    lastSeen: Date.now()
                                }
                                sessionsHandler.addSession(session);
                                dataPacket.data = {
                                    sessionId: session.id
                                }
                                ws.send(JSON.stringify(dataPacket));
                                break;
                            case API_PING_SESSION:
                                const temp = await this.sessionsHandler.getSession(dataPacket.data.sessionId);
                                if (temp !== undefined) {
                                    const session: Session | any = temp;
                                    session.lastSeen = Date.now();
                                    sessionsHandler.addSession(session);
                                }
                                break;
                            case API_SYNC_LOGS:
                                logsHandler.saveClientLog(dataPacket.data.sessionId, dataPacket.data.log);
                                break;
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        });

        wss.on('close', (ws: WebSocket) => {
            // here we ll remove the user agent
        });

        wss.on('error', (ws: WebSocket, error: Error) => {
            console.log(error);
            // here also we ll remove the user agent
        });

    }

}