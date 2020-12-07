import * as WebSocket from 'ws';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { Session } from './Session';
import { API_ACTIVE_SESSIONS, API_SYNC_LOGS, DataPacket } from './DataPacket';
import { objectFromMap } from './__utils__';
import { SessionsHandler } from './SessionsHandler';
import { LogsHandler } from './LogsHandler';
import { Log } from './Log';

export class DebuggerServerHandler {

    ws?: WebSocket | any;

    constructor(
        public port: number,
        public sessionsHandler: SessionsHandler,
        public logsHandler: LogsHandler
    ) {

        const app = express();
        app.use((request, respopnse, next) => {
            const filename = path.basename(request.url);
            console.log(filename);
            if (filename === "__web_debugger_debugger__.js") {
                fs.readFile(path.join(__dirname, '../debugger/__web_debugger_debugger__.js'), "utf8", (error, data) => {
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
        app.use(express.static(path.join(__dirname, '../debugger')));
        // directoryApp.get('/', function (request, response) {
        //     response.send('Hello World');
        // });
        const server = app.listen(port);

        const wss = new WebSocket.Server({ server: server });
        wss.on('connection', (ws: WebSocket) => {
            this.ws = ws;
            this.sessionsHandler.onFileChange.subscribe(async change => {
                if (change) {
                    const sessions: Map<string, Session> = await this.sessionsHandler.getSessions();
                    const dataPacket: DataPacket = {
                        api: API_ACTIVE_SESSIONS,
                        data: {
                            sessions: objectFromMap(sessions)
                        }
                    };
                    this.ws.send(JSON.stringify(dataPacket));
                }
            });
            ws.on('message', (message: string) => {
                try {
                    const dataPacket: DataPacket = JSON.parse(message);
                    if (dataPacket !== undefined) {
                        switch (dataPacket.api) {
                            case API_SYNC_LOGS:
                                this.logsHandler.onFileChange.subscribe(async change => {
                                    if (change) {
                                        const logs: Array<Log> = await this.logsHandler.getClientLogs(dataPacket.data.sessionId);
                                        dataPacket.data.logs =  logs
                                        console.log(dataPacket);
                                        this.ws.send(JSON.stringify(dataPacket));
                                    }
                                });
                                break;
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        });

        wss.on('close', (ws: WebSocket) => {
            this.ws = undefined;
            // here we ll remove the user agent
        });

        wss.on('error', (ws: WebSocket, error: Error) => {
            this.ws = undefined;
            console.log(error);
            // here also we ll remove the user agent
        });

    }
    
}