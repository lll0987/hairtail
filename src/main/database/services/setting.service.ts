import { settingModel, settingName } from '../models';
import { BaseService } from '../base/BaseService';

export class SettingService extends BaseService {
    static name = settingName.toLowerCase();

    constructor() {
        super(settingName, settingModel);
    }
}
