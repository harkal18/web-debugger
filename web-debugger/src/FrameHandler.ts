import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import { FileDatabaseHandler } from './FileDatabaseHandler';

const dir = (filePath: string) =>  filePath.substring(0, filePath.lastIndexOf("/"));

export class FrameHandler extends FileDatabaseHandler {

    constructor(public sessionId: string) {
        super();
    }
    
    getFilePath(): string {
        return path.resolve(__dirname, `../data/frames/${this.sessionId}.txt`);
    }
    
    saveClientFrame(frame: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await mkdirp(dir(this.getFilePath()));
                fs.writeFile(this.getFilePath(), frame, { flag: 'w' }, (error) => {
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

    getClientFrame(): Promise<string> {
        return new Promise((resolve, reject) => {
            try {
                fs.readFile(this.getFilePath(), "utf8", async (error, data) => {
                    if (!error) {
                        resolve(data);
                    } else {
                        reject(`Failed to get sessions : ${error}`);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    
}