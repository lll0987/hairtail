import { ObjectId } from '../types';

export interface RecordModel {
    in: string;
    out: string;
    event?: ObjectId[];
    info?: ObjectId[];
    tag?: ObjectId[];
    topic?: ObjectId[];
}

export interface IRecord extends Pick<RecordModel, 'in' | 'out'> {
    id?: string;
}
