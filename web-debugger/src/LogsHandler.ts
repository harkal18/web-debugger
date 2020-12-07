import fs from 'fs';
import path from 'path';
import { Log } from './Log';
import { mapFromObject, objectFromMap } from './__utils__';

const LOGS = path.resolve(__dirname, "../data/logs.json");


export class LogsHandler {

    private saveLogs(logs: Map<string, Array<Log>>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                fs.writeFile(LOGS, JSON.stringify(objectFromMap(logs)), { flag: 'w' }, (error) => {
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

    saveClientLog(sessionId: string, log: Log): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                fs.stat(LOGS, async (error, stat) => {
                    if (!error) {
                        const logs: Map<string, Array<Log>> = await this.getLogs();
                        let newLogs = logs.get(sessionId) || [];
                        newLogs.push(log);
                        logs.set(sessionId, newLogs);
                        await this.saveLogs(logs);
                        resolve();
                    } else {
                        if (error.code === "ENOENT") {
                            const logs: Map<string, Array<Log>> = new Map();
                            logs.set(sessionId, [log]);
                            await this.saveLogs(logs);
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

    getLogs(): Promise<Map<string, Array<Log>>> {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(LOGS, "utf8", async (error, data) => {
                    if (!error) {
                        const logs: Map<string, Array<Log>> = mapFromObject(JSON.parse(data));
                        resolve(logs);
                    } else {
                        reject(`Failed to get sessions : ${error}`);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    getClientLogs(sessionId: string): Promise<Array<Log>> {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(LOGS, "utf8", async (error, data) => {
                    if (!error) {
                        const logs: Map<string, Array<Log>> = mapFromObject(JSON.parse(data));
                        resolve(logs.get(sessionId) || []);
                    } else {
                        reject(error);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteClientLogs(sessionId: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const logs: Map<string, Array<Log>> = await this.getLogs();
                logs.delete(sessionId);
                await this.saveLogs(logs);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    
}