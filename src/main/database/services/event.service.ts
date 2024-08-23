import { eventModel, eventName, topicName } from '../models';
import { BaseService } from '../base/BaseService';
import { IEventRawData, IEvent } from '@contracts/interface';
import { TApiResponse } from '@contracts/type';

export class EventService extends BaseService {
    static name = eventName.toLowerCase();

    constructor() {
        super(eventName, eventModel);
    }

    async list(match: object = {}) {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<IEvent[]>>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .aggregate([
                    { $match: match },
                    { $addFields: { id: { $toString: '$_id' }, grain: { $toString: '$grain' } } }
                ])
                .then(r => {
                    this.logger.info('list', 'success', r);
                    resolve([null, r]);
                })
                .catch(e => {
                    this.logger.error('list', 'fail', e);
                    resolve(['查询失败', []]);
                });
        });
    }

    async list_color() {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<IEventRawData[]>>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .aggregate([
                    {
                        $lookup: {
                            from: topicName,
                            localField: 'topic',
                            foreignField: 'name',
                            as: 'topicInfo'
                        }
                    },
                    {
                        $unwind: '$topicInfo'
                    },
                    {
                        $addFields: {
                            color: '$topicInfo.color',
                            id: { $toString: '$_id' },
                            grain: { $toString: '$grain' }
                        }
                    }
                ])
                .then(r => {
                    this.logger.info('list', 'success', r);
                    resolve([null, r]);
                })
                .catch(e => {
                    this.logger.error('list', 'fail', e);
                    resolve(['查询失败', []]);
                });
        });
    }
}
