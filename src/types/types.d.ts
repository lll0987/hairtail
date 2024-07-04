export type MsgType = string;

export type ResType<T> = [MsgType, null] | [null, T];
