import { DateTimeGrain } from './enum';

export interface IEvent {
    start: number;
    end: number;
    grain: DateTimeGrain;
    title?: string;
    value?: number;
}
