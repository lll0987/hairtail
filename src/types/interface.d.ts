import { Component } from 'vue';
import { DateTimeGrain } from './enum';

export interface IEvent {
    start: number;
    end: number;
    grain: DateTimeGrain;
    topic: string;
    title?: string;
    value?: number;
    remark?: string;
}

export interface IRecord {
    in: string;
    out: string;
}

export interface IRoute {
    key: string;
    label: string;
    icon: Component;
    component?: Component;
}

export interface IRequest {
    text: string;
    today: string;
    topic: string[];
}

export interface TagBody {
    name: string;
    color: string;
}
export interface TopicBody {
    name: string;
    color: string;
}
export interface EventBody {
    start: string;
    end: string;
    grain: DateTimeGrain;
    topic: string;
    title?: string;
    value?: number;
    remark?: string;
}

export interface IResponse {
    status: 0 | 1;
    data: {
        events?: EventBody[];
        tags?: TagBody[];
        topics?: TopicBody[];
    };
}
