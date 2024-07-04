import { eventModel, eventName } from '../models';
import { BaseService } from '../base/BaseService';
import { IEvent } from '@t/interface';
import { MsgType } from '@t/types';

export class EventService extends BaseService {
    static name = eventName.toLowerCase();

    constructor() {
        super(eventName, eventModel);
    }

    async list(): Promise<[MsgType | null, IEvent[]]> {
        const [msg, data] = await super.list();
        const events = data.map(({ grain, ...item }) => ({ ...item, grain: grain + '' }));
        return [msg, events];
    }
}
