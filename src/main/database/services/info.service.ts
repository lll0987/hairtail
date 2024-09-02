import { IInfoModel } from '@contracts/interface';
import { infoModel, infoName } from '../models';
import { BaseService } from '../base/BaseService';

export class InfoService extends BaseService<IInfoModel> {
    static name = infoName.toLowerCase();

    constructor() {
        super(infoName, infoModel);
    }
}
