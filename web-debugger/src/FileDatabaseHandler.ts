import { BehaviorSubject } from "rxjs";
import fs from 'fs';

export abstract class FileDatabaseHandler {

    watching = false;
    onFileChange: BehaviorSubject<boolean> = new BehaviorSubject(<boolean>false);

    constructor() {
        this.watch();
    }

    private watch() {
        if(!this.watching){
            if(fs.existsSync(this.getFilePath())){
                this.watching = true;
                fs.watch(this.getFilePath(), (event, filename) => {
                    this.onFileChange.next(true);     
                });
            }else{
                setTimeout(() => {
                    this.watch();
                }, 5000);
            }
        }
    }

    abstract getFilePath(): string;

}