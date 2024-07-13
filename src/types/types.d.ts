export type MsgType = string;

export type ResType<T> = [MsgType, null] | [null, T];

import { Schema } from 'mongoose';
export type ObjectId = Schema.Types.ObjectId;
