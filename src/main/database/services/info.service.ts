import { infoModel, infoName } from '../models';
import { BaseService } from '../base/BaseService';

export class InfoService extends BaseService {
    static name = infoName.toLowerCase();

    constructor() {
        super(infoName, infoModel);
    }
}
