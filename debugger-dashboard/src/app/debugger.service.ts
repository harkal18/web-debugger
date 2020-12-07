import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mapFromObject } from './utils/mics';

export const API_START_SESSION = "API_START_SESSION";
export const API_PING_SESSION = "API_PING_SESSION";

export const API_ACTIVE_SESSIONS = "API_ACTIVE_SESSIONS";
export const API_SYNC_LOGS = "API_SYNC_LOGS";

export class DataPacket {
  error?: boolean;
  api?: string;
  message?: string;
  data?: any;
}

export class Session {
  id?: string;
  userAgent?: string;
  time?: number;
  lastSeen?: number;
}

export class Log {
  type?: string;
  args?: any;
  ref?: string; // dekhna possible ho pae to
}

@Injectable({
  providedIn: 'root'
})
export class DebuggerService {

  socket: WebSocket;
  sessions: BehaviorSubject<Map<string, Session>> = new BehaviorSubject(new Map());
  logs: Map<string, BehaviorSubject<Array<Log>>> = new Map();

  constructor() {
    if (isDevMode()) {
      this.socket = new WebSocket('ws://localhost:8888');
    } else {
      this.socket = new WebSocket('ws://localhost:{PORT}');
    }

    // Connection opened
    this.socket.addEventListener('open', (event) => {

    });

    // Listen for messages
    this.socket.addEventListener('message', (event) => {
      try {
        const dataPacket: DataPacket = JSON.parse(event.data);
        switch (dataPacket.api) {
          case API_ACTIVE_SESSIONS:
            this.sessions.next(mapFromObject(dataPacket.data.sessions));
            break;
          case API_SYNC_LOGS:
            this.logs.get(dataPacket.data.sessionId)?.next(dataPacket.data.logs);
            break;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  syncClientLogs(sessionId: string): BehaviorSubject<Array<Log>> | any {
    this.socket.send(JSON.stringify({
      api: API_SYNC_LOGS,
      data: {
        sessionId: sessionId
      }
    }));
    if(this.logs.get(sessionId) === undefined){
      this.logs.set(sessionId, new BehaviorSubject(<Array<Log>>[]));
    }
    return this.logs.get(sessionId);
  }

}
