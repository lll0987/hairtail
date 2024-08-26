import { TMentionTag, TMention } from '..';

export const MENTION_TYPE: TMention = 'editor-mention';
export const MENTION_TAG_TYPE: TMentionTag = 'editor-mention-tag';

export enum MENTION_EVENT {
    KEYDOWN = 'cusKeydown',
    INSERT = 'cusInsert',
    POSITIVE = 'cusPositive',
    NEGATIVE = 'cusNegative'
}
