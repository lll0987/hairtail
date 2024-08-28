export const RECORD_STATUS = {
    SEND: 0,
    WAITING: 1,
    ACCEPT: 2,
    IGNORE: 3,
    NONE: 4,
    ERROR: 5
} as const;

export type TRecordStatus = typeof RECORD_STATUS;
export type RecordStatus = TRecordStatus[keyof TRecordStatus];
