
import { Server } from 'http';
import * as WebSocket from 'ws';
import express from 'express';
import { Express } from 'express';
import fs from 'fs';
import path from 'path';

import { BehaviorSubject, Subscription } from 'rxjs'
import { Session } from './Session';
import { API_ACTIVE_SESSIONS, DataPacket } from './DataPacket';
import { objectFromMap } from './__utils__';
import { DatabaseHandler } from './DatabaseHandler';

export class DebuggerServerHandler {

    ws?: WebSocket | any;

    constructor(public port: number, public databaseHandler: DatabaseHandler) {

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
            this.refreshSessions();
            ws.on('message', (message: string) => {
                try {
                    const dataPacket: DataPacket = JSON.parse(message);
                    if (dataPacket !== undefined) {
                        switch (dataPacket.api) {
                            // here we can drop connections of the clients
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

    private refreshSessions() {
        (async () => {
            try {
                if (this.ws !== undefined) {
                    const sessions: Map<string, Session> = await this.databaseHandler.getSessions();
                    const dataPacket: DataPacket = {
                        api: API_ACTIVE_SESSIONS,
                        data: {
                            sessions: objectFromMap(sessions)
                        }
                    };
                    this.ws.send(JSON.stringify(dataPacket));
                    setTimeout(() => {
                        this.refreshSessions();
                    }, 5000);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }

}