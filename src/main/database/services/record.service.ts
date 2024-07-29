import { recordModel, recordName } from '../models';
import { BaseService } from '../base/BaseService';

export class RecordService extends BaseService {
    static name = recordName.toLowerCase();

    constructor() {
        super(recordName, recordModel);
    }

    filter() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return super.list({ createdAt: { $gte: today } });
    }
}
