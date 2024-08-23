import { parseExpression } from 'cron-parser';
import { TApiResponse } from '@contracts/type';
import { ICron } from '@contracts/interface';
import { cronModel, cronName } from '../models';
import { BaseService } from '../base/BaseService';
import { EventService } from './event.service';
import { services } from '.';

export class CronService extends BaseService {
    static name = cronName.toLowerCase();

    constructor() {
        super(cronName, cronModel);
    }

    private getCronTimestamp(str: string, last = false): number | null {
        if (isNaN(Date.parse(str))) {
            const now = Date.now();
            const pe = parseExpression(str);
            if (last) {
                let ts = pe.prev().getTime();
                while (ts > now) {
                    ts = pe.prev().getTime();
                }
                return ts;
            } else {
                let ts = pe.next().getTime();
                while (ts < now) {
                    ts = pe.next().getTime();
                }
                return ts;
            }
        } else {
            return new Date(str).getTime();
        }
    }

    async list_today() {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<ICron[]>>(resolve => {
            if (msg) return resolve([msg, []]);
            super.list().then(([msg, data]: TApiResponse<ICron[]>) => {
                if (msg) return resolve([msg, []]);
                const service = services.event as EventService;
                const promises = data.reduce(
                    (res, item: ICron) => {
                        const start = this.getCronTimestamp(item.start, true);
                        const end = this.getCronTimestamp(item.end);
                        this.logger.debug('list', start, end);
                        if (start && end) {
                            res.push(
                                new Promise(resolve => {
                                    service
                                        .list({
                                            $and: [
                                                { start: { $gte: start } },
                                                { start: { $lte: end } },
                                                { tags: { $in: [item.tag] } }
                                            ]
                                        })
                                        .then(([msg, data]) => {
                                            resolve(
                                                !msg && !data.length
                                                    ? { ...item, length: new Date().getTime() - end }
                                                    : null
                                            );
                                        });
                                })
                            );
                        }
                        return res;
                    },
                    [] as Promise<ICron | null>[]
                );
                Promise.all(promises).then(r => {
                    resolve([null, r.filter(i => !!i)]);
                });
            });
        });
    }
}
