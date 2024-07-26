export interface MentionConfig {
    prefix?: string | string[];
    separator?: string;
}

export interface IExtendConfig {
    mentionConfig: MentionConfig;
}

export interface PureText {
    text: string;
}

export interface IMentionTag {
    color?: string;
    label: string;
}

export interface IMention {
    tags: IMentionTag[];
    text: PureText[];
}

export type MentionType = 'mention';
export type MentionTagType = 'mention-tag';

export interface MentionTag extends IMentionTag {
    type: MentionTagType;
    children: [{ text: '' }];
}

export type MentionChild = MentionTag | PureText;

export type MentionElement = {
    type: MentionType;
    children: MentionChild[];
};

export enum MentionEvent {
    INSERT = 'cusInsert',
    HIDE = 'cusHide',
    POSITIVE = 'cusPositive'
}
