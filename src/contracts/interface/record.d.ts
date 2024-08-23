import { RecordStatus } from '@contracts/enum';
import { ObjectId } from '../types';
import { IModel } from '.';

export interface IRecordModel {
    in: string;
    out: string;
    status: RecordStatus;
    event?: ObjectId[];
    info?: ObjectId[];
    tag?: ObjectId[];
    topic?: ObjectId[];
}

export interface IRecord extends Pick<IRecordModel, 'in' | 'out' | 'status'>, IModel {}
