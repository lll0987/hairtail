import { DateTimeGrain } from '../enum';

export interface EventModel {
    start: number;
    end: number;
    grain: number;
    topic: string;
    title?: string;
    value?: number;
    remark?: string;
    tags?: string[];
    infos: string[];
}

export interface IEvent extends Omit<EventModel, 'tags' | 'infos' | 'grain'> {
    grain: DateTimeGrain;
    id?: string;
}

export interface EventBody extends Omit<EventModel, 'tags' | 'infos' | 'grain' | 'start' | 'end'> {
    start: string;
    end: string;
    grain: DateTimeGrain;
}
