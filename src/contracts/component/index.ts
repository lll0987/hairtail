import type { TRecordStatus } from '../type';

export * from './colors';
export * from './status';

export enum KEYBOARD_EVENT {
    DOWN = 'ArrowDown',
    ENTER = 'Enter',
    UP = 'ArrowUp'
}

export type TCSize = 'small' | 'large';

export const RECORD_STATUS: TRecordStatus = {
    SEND: 0,
    WAITING: 1,
    ACCEPT: 2,
    IGNORE: 3,
    NONE: 4,
    ERROR: 5
} as const;
