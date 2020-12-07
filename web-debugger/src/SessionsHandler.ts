import fs from 'fs';
import path from 'path';
import { FileDatabaseHandler } from './FileDatabaseHandler';
import { Session } from "./Session";
import { mapFromObject, objectFromMap } from './__utils__';

const SESSIONS = path.resolve(__dirname, "../data/sessions.json");


export class SessionsHandler extends FileDatabaseHandler {

    getFilePath(): string {
        return SESSIONS;
    }

    private saveSessions(sessions: Map<string, Session>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const temp: Map<string, Session> = new Map();
                sessions.forEach((value: Session | any, sessionId: string) => {
                    if(value.lastSeen > Date.now() - 10000){
                        temp.set(sessionId, value);
                    }
                });
                fs.writeFile(SESSIONS, JSON.stringify(objectFromMap(temp)), { flag: 'w' }, (error) => {
                    if (!error) {
                        resolve();
                    } else {
                        reject(`Failed to save sessions : ${error}`);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    addSession(session: Session | any): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                fs.stat(SESSIONS, async (error, stat) => {
                    if (!error) {
                        const sessions: Map<string, Session> = await this.getSessions();
                        sessions.set(session.id, session);
                        await this.saveSessions(sessions);
                        resolve();
                    } else {
                        if (error.code === "ENOENT") {
                            const sessions: Map<string, Session> = new Map();
                            sessions.set(session.id, session);
                            await this.saveSessions(sessions);
                            resolve();
                        } else {
                            reject(error);
                        }
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getSessions(): Promise<Map<string, Session>> {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(SESSIONS, "utf8", async (error, data) => {
                    if (!error) {
                        const sessions: Map<string, Session> = mapFromObject(JSON.parse(data));
                        resolve(sessions);
                    } else {
                        reject(`Failed to get sessions : ${error}`);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getSession(sessionId: string): Promise<Session | undefined> {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(SESSIONS, "utf8", async (error, data) => {
                    if (!error) {
                        const sessions: Map<string, Session> = mapFromObject(JSON.parse(data));
                        resolve(sessions.get(sessionId));
                    } else {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteSession(session: Session | any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const sessions: Map<string, Session> = await this.getSessions();
                sessions.delete(session.id);
                await this.saveSessions(sessions);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
}