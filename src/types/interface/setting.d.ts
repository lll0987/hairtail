import { EventModel } from './event';

export interface EventSetting extends Partial<Pick<EventModel, 'tags' | 'topic' | 'value'>> {
    text?: string;
}

export interface SettingModel {
    label: string;
    value: EventSetting;
}

export interface ISetting extends SettingModel {
    id?: string;
}
