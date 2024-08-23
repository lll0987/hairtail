import { IModel } from '.';
import { IEventModel } from './event';

export interface EventSetting extends Partial<Pick<IEventModel, 'tags' | 'topic' | 'value'>> {
    value?: number | null;
    text?: string;
}

export interface ISettingModel {
    label: string;
    value: EventSetting;
}

export interface ISetting extends ISettingModel, IModel {}
