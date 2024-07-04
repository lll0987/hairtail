import { tagModel, tagName } from '../models';
import { BaseService } from '../base/BaseService';

export class TagService extends BaseService {
    static name = tagName.toLowerCase();

    constructor() {
        super(tagName, tagModel);
    }
}
