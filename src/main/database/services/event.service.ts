import { FilterQuery } from 'mongoose';
import { EventGrain, TResponse } from '@contracts/type';
import { IEventRawData, IEvent, IEventModel } from '@contracts/interface';
import { eventModel, eventName, topicName } from '../models';
import { BaseService } from '../base/BaseService';

export class EventService extends BaseService<IEventModel> {
    static name = eventName.toLowerCase();

    constructor() {
        super(eventName, eventModel);
    }

    list2(filter?: FilterQuery<IEvent>) {
        return new Promise<TResponse<IEvent, true>>(resolve => {
            super.list(filter).then(([msg, docs]) => {
                if (msg) {
                    resolve([msg, []]);
                } else {
                    const data = docs.map(doc => ({ ...doc, grain: doc.grain.toString() as EventGrain }));
                    resolve([null, data]);
                }
            });
        });
    }

    async list_color() {
        const [msg] = await this.connect();
        return new Promise<TResponse<IEventRawData, true>>(resolve => {
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
