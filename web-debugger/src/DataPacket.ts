
export const API_START_SESSION = "API_START_SESSION";
export const API_PING_SESSION = "API_PING_SESSION";

export const API_ACTIVE_SESSIONS = "API_ACTIVE_SESSIONS";

export class DataPacket {
    error?: boolean;
    api?: string;
    message?: string;
    data?: any;
}