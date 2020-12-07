import { API_SYNC_LOGS, DataPacket } from "./DataPacket";



export class ClientLogsHandler {

    started = false;

    constructor(public webSocket: WebSocket) {
        try {
            // @ts-ignore: 
            window.__famenun_logger__ = console.log;
            this.clearLogs();
            console.log = (...args: any) => {
                this.addLogs(args);
                this.sendLogs(args);
            }
        } catch (error) {
            console.log(error);
        }
    }

    start() {
        if(!this.started){
            this.started = true;
        }
        for(const log of this.getLogs()){
            this.sendLogs(log);
        }
    }

    sendLogs(...args: any) {
        if(this.started){
            const dataPacket: DataPacket = {
                api: API_SYNC_LOGS,
                data: {
                    // @ts-ignore: 
                    sessionId: window.__web_debugger__.sessionId,
                    log: {
                        type: "LOG",
                        args: args
                    }
                }
            }
            this.webSocket.send(JSON.stringify(dataPacket));
        }
    }

    clearLogs() {
        // @ts-ignore: 
        window.__famenun_logger_logs__ = [];
    }

    addLogs(...args: any) {
        // @ts-ignore: 
        window.__famenun_logger_logs__.push(args);
        // @ts-ignore: 
        window.__famenun_logger__.apply(window.__famenun_logger__, args);
    }

    getLogs() {
        // @ts-ignore: 
        return window.__famenun_logger_logs__;
    }

}