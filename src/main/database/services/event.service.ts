import { eventModel, eventName, topicName } from '../models';
import { BaseService } from '../base/BaseService';
import { EventRawData, IEvent } from '@t/interface';
import { MsgType } from '@t/types';

export class EventService extends BaseService {
    static name = eventName.toLowerCase();

    constructor() {
        super(eventName, eventModel);
    }

    async list(): Promise<[MsgType | null, IEvent[]]> {
        const [msg] = await this.connect();
        return new Promise<[MsgType | null, EventRawData[]]>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .aggregate([{ $addFields: { id: { $toString: '$_id' }, grain: { $toString: '$grain' } } }])
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

    async listWithColor() {
        const [msg] = await this.connect();
        return new Promise<[MsgType | null, EventRawData[]]>(resolve => {
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
