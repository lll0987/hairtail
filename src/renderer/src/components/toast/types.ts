export type MessageType = 'info' | 'success' | 'warning' | 'error';

export interface MessageProps {
    message: string;
    type?: MessageType;
    duration?: number;
}

export interface ToastApi {
    info: (message: string) => void;
    success: (message: string) => void;
    warning: (message: string) => void;
    error: (message: string) => void;
}
