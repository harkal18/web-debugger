
export const API_START_SESSION = "API_START_SESSION";
export const API_PING_SESSION = "API_PING_SESSION";

export const API_ACTIVE_SESSIONS = "API_ACTIVE_SESSIONS";
export const API_SYNC_LOGS = "API_SYNC_LOGS";
export const API_SYNC_FRAME = "API_SYNC_FRAME";

export class DataPacket {
    error?: boolean;
    api?: string;
    message?: string;
    data?: any;
}