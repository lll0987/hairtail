import { IDomEditor } from '@wangeditor/editor';

export interface IExtendConfig {
    mentionConfig: {
        showPopover: (editor: IDomEditor) => void;
        hidePopover: (editor: IDomEditor) => void;
        prefix?: string | string[];
    };
}

type PureText = { text: string };

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
