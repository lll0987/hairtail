import { IModel } from '.';

export interface IInfoModel {
    name: string;
    atta?: string;
    remark?: string;
    value?: number;
    tag?: string;
    min?: number;
    total?: number;
}

export interface IInfo extends IInfoModel, IModel {}

export interface IInfoBody extends Omit<IInfoModel, 'atta'> {}
