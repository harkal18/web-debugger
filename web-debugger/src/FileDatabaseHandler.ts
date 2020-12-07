import { BehaviorSubject } from "rxjs";
import fs from 'fs';

export abstract class FileDatabaseHandler {

    onFileChange: BehaviorSubject<boolean> = new BehaviorSubject(<boolean>false);

    constructor() {
        fs.watch(this.getFilePath(), (event, filename) => {
            this.onFileChange.next(true);     
        });
    }

    abstract getFilePath(): string;

}