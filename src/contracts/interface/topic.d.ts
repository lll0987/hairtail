import { IModel } from '.';

export interface ITopicModel {
    name: string;
    color: string;
}

export interface ITopic extends ITopicModel, IModel {}

export interface ITopicBody extends ITopicModel {}
