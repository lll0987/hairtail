import { IRecordModel } from '@contracts/interface';
import { recordModel, recordName } from '../models';
import { BaseService } from '../base/BaseService';

export class RecordService extends BaseService<IRecordModel> {
    static name = recordName.toLowerCase();

    constructor() {
        super(recordName, recordModel);
    }

    list_today() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return super.list({ createdAt: { $gte: today } });
    }
}
