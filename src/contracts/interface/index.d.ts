import type { Component } from 'vue';
export interface IRoute {
    key: string;
    label: string;
    icon: Component;
    component?: Component;
}

export interface IModel {
    id?: string;
}

export * from './cron';
export * from './event';
export * from './info';
export * from './record';
export * from './setting';
export * from './tag';
export * from './topic';

export interface IRequest {
    text: string;
    today: string;
    topic: string[];
}

import type { IEventBody } from './event';
import type { ITagBody } from './tag';
import type { ITopicBody } from './topic';
export interface IResponse {
    status: 0 | 1;
    data: {
        events?: IEventBody[];
        tags?: ITagBody[];
        topics?: ITopicBody[];
    };
}
