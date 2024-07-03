import { recordModel, recordName } from '../models';
import { BaseService } from '../base/BaseService';

export class RecordService extends BaseService {
    static name = recordName.toLowerCase();

    constructor() {
        super(recordName, recordModel);
    }
}
