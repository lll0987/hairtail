import { IRecordModel } from '@contracts/interface';
import { recordModel, recordName } from '../models';
import { BaseService } from '../base/BaseService';

export class RecordService extends BaseService<IRecordModel> {
    static name = recordName.toLowerCase();

    constructor() {
        super(recordName, recordModel);
    }
}
