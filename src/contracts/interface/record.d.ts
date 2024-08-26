import { Types } from 'mongoose';
import { RecordStatus } from '../type';
import { IModel } from '.';

export interface IRecordModel {
    in: string;
    out: string;
    status: RecordStatus;
    event?: Types.ObjectId[];
    info?: Types.ObjectId[];
    tag?: Types.ObjectId[];
    topic?: Types.ObjectId[];
}

export interface IRecord extends Pick<IRecordModel, 'in' | 'out' | 'status'>, IModel {}
