import { IModel } from '.';
import { DateTimeGrain } from '../type';

export interface IEventModel {
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

export interface IEvent extends Omit<IEventModel, 'tags' | 'infos' | 'grain'>, IModel {
    grain: DateTimeGrain;
}

export interface IEventBody extends Omit<IEventModel, 'infos' | 'grain' | 'start' | 'end'> {
    start: string;
    end: string;
    grain: DateTimeGrain;
}

export interface IEventRawData extends IEvent {
    color: string;
}
