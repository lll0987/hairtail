import { RecordStatus } from '@t/enum';
import { ObjectId } from '../types';

export interface RecordModel {
    in: string;
    out: string;
    status: RecordStatus;
    event?: ObjectId[];
    info?: ObjectId[];
    tag?: ObjectId[];
    topic?: ObjectId[];
}

export interface IRecord extends Pick<RecordModel, 'in' | 'out' | 'status'> {
    id?: string;
}
