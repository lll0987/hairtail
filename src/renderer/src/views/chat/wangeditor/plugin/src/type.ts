export interface IMentionConfig {
    prefix?: string | string[];
    separator?: string;
}

export interface IExtendConfig {
    mentionConfig: IMentionConfig;
}

export interface IPureText {
    text: string;
}

export interface IMention {
    tags: IPureText[];
    text: IPureText[];
}

export type TMention = 'editor-mention';
export type TMentionTag = 'editor-mention-tag';

export interface IMentionTag {
    type: TMentionTag;
    children: [{ text: '' }];
    tagName: string;
}

export type TMentionChild = IMentionTag | IPureText;

export type MentionElement = {
    type: TMention;
    children: TMentionChild[];
};
