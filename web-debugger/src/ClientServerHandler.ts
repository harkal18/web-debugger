
import * as WebSocket from 'ws';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { API_PING_SESSION, API_START_SESSION, API_SYNC_FRAME, API_SYNC_LOGS, DataPacket } from './DataPacket';
import { Session } from './Session';
import { generateRandomString } from './__utils__';
import { SessionsHandler } from './SessionsHandler';
import { LogsHandler } from './LogsHandler';
import { FrameHandler } from './FrameHandler';

const getHtml = (filename: string, port: number) => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(path.join(__dirname, '../client/__web_debugger_client__.js'), "utf8", (error, javascript) => {
                if (!error) {
                    fs.readFile(filename, "utf8", (error, html) => {
                        if (!error) {
                            const dom = new JSDOM(html);
                            const script = dom.window.document.createElement("script");
                            script.innerHTML = javascript.replace("{PORT}", `${port}`);
                            dom.window.document.body.appendChild(script);
                            // dom.window.document.body.append(`<script>${javascript.replace("{PORT}", `${port}`)}</script>`);
                            resolve(dom.serialize());
                        }else{
                            resolve(reject(error));
                        }
                    });
                }else{
                    resolve(reject(error));
                }
            });
        }catch(error){
            reject(error);
        }
    });
}

export class ClientServerHandler {

    constructor(
        public directory: string,
        public port: number,
        public sessionsHandler: SessionsHandler,
        public logsHandler: LogsHandler
    ) {

        const app = express();
        app.use(async (request, response, next) => {
            const filename = path.basename(request.url);
            if(path.extname(filename) === ".html"){
                getHtml(filename, port).then(html => {
                    response.set('content-type', 'text/html');
                    response.send(html);
                }).catch(error => {
                    console.log(error);
                    response.set('content-type', 'text/html');
                    response.send("<h1>404</h1>");
                });
            }else{
                next();
            }
        });
        app.get('/', (request, response) => {
            const filename = path.resolve(directory, "index.html");
            getHtml(filename, port).then(html => {
                response.set('content-type', 'text/html');
                response.send(html);
            }).catch(error => {
                console.log(error);
                response.set('content-type', 'text/html');
                response.send("<h1>404</h1>");
            });
        });
        app.use(express.static(directory, { index: false }));
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
                                await sessionsHandler.addSession(session);
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
                                await logsHandler.saveClientLog(dataPacket.data.sessionId, dataPacket.data.log);
                                break;
                            case API_SYNC_FRAME:
                                await new FrameHandler(dataPacket.data.sessionId).saveClientFrame(dataPacket.data.frame);
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