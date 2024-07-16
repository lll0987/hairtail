export * from './event';
export * from './info';
export * from './record';
export * from './tag';
export * from './topic';

import { Component } from 'vue';
export interface IRoute {
    key: string;
    label: string;
    icon: Component;
    iconFilled: Component;
    component?: Component;
}

export interface IRequest {
    text: string;
    today: string;
    topic: string[];
}

import { EventBody } from './event';
import { TagBody } from './tag';
import { TopicBody } from './topic';
export interface IResponse {
    status: 0 | 1;
    data: {
        events?: EventBody[];
        tags?: TagBody[];
        topics?: TopicBody[];
    };
}
