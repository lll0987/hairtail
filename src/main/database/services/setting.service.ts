import { ISettingModel } from '@contracts/interface';
import { settingModel, settingName } from '../models';
import { BaseService } from '../base/BaseService';

export class SettingService extends BaseService<ISettingModel> {
    static name = settingName.toLowerCase();

    constructor() {
        super(settingName, settingModel);
    }
}
