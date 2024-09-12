import { IModel } from '.';
import { EventGrain } from '../type';

export interface IEventModel {
    start: number;
    end: number;
    grain: number;
    topic: string;
    title?: string;
    value?: number;
    remark?: string;
    tags?: string[];
    infos?: string[];
}

export interface IEvent extends IEventModel, IModel {}

export interface IEventBody extends Omit<IEventModel, 'infos' | 'grain' | 'start' | 'end'> {
    start: string;
    end: string;
    grain: EventGrain;
}

export interface IEventRawData extends IEvent {
    color: string;
}
