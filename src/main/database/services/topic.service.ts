import { ITopicModel } from '@contracts/interface';
import { topicModel, topicName } from '../models';
import { BaseService } from '../base/BaseService';

export class TopicService extends BaseService<ITopicModel> {
    static name = topicName.toLowerCase();

    constructor() {
        super(topicName, topicModel);
    }
}
