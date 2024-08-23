import { IModel } from '.';

export interface ITagModel {
    name: string;
    color: string;
    c2?: string;
    alias?: string;
}

export interface ITag extends ITagModel, IModel {}

export interface ITagBody extends ITagModel {}
