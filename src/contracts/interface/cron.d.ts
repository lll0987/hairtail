import { IModel } from '.';

export interface ICronModel {
    msg: string;
    tag: string;
    start: string;
    end: string;
    topic?: string;
}

export interface ICron extends ICronModel, IModel {
    length?: number;
}
