import { Component } from 'vue';
import { DateTimeGrain } from './enum';

export interface IEvent {
    start: number;
    end: number;
    grain: DateTimeGrain;
    title?: string;
    value?: number;
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
