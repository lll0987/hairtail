import { IModel } from '.';

interface BaseInfo {
    name: string;
    atta?: string;
    remark?: string;
}

interface BalanceInfo extends BaseInfo {
    value: number;
    tag: string;
    min?: number | null;
}

export type IInfoModel = BaseInfo | BalanceInfo;

export interface IInfo extends IInfoModel, IModel {}

export interface IInfoBody extends Omit<IInfoModel, 'atta'> {}
