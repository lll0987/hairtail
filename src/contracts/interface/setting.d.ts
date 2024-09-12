import { IModel } from '.';
import { IEventModel } from './event';

export interface EventSetting extends Partial<Pick<IEventModel, 'tags' | 'topic' | 'value'>> {
    text?: string;
    length?: number;
}

export interface ISettingModel {
    label: string;
    value: EventSetting;
}

export interface ISetting extends ISettingModel, IModel {}
