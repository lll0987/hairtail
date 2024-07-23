export interface MentionConfig {
    prefix?: string | string[];
}

export interface IExtendConfig {
    mentionConfig: MentionConfig;
}

export type PureText = { text: string };

export type MentionType = 'mention';
export type MentionTagType = 'mention-tag';

export type MentionTag = {
    type: MentionTagType;
    color: string;
    children: PureText[];
};

export type MentionChild = MentionTag | PureText;

export type MentionElement = {
    type: MentionType;
    children: MentionChild[];
};

type IMentionTag = PureText & Pick<MentionTag, 'color'>;
export interface IMention {
    tags: IMentionTag[];
    text: PureText[];
}
