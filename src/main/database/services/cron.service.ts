import { parseExpression } from 'cron-parser';
import { TResponse } from '@contracts/type';
import { ICron, ICronModel } from '@contracts/interface';
import { cronModel, cronName } from '../models';
import { BaseService } from '../base/BaseService';
import { services } from '.';

export class CronService extends BaseService<ICronModel> {
    static name = cronName.toLowerCase();

    constructor() {
        super(cronName, cronModel);
    }

    private getCronTimestamp(str: string, last = false): number | null {
        if (isNaN(Date.parse(str))) {
            const now = Date.now();
            const pe = parseExpression(str);
            let ts: number;
            if (last) {
                ts = pe.prev().getTime();
                while (ts > now) {
                    ts = pe.prev().getTime();
                }
            } else {
                ts = pe.next().getTime();
                while (ts < now) {
                    ts = pe.next().getTime();
                }
            }
            return ts;
        } else {
            return new Date(str).getTime();
        }
    }

    async list_today() {
        const [msg] = await this.connect();
        return new Promise<TResponse<ICron, true>>(resolve => {
            if (msg) return resolve([msg, []]);
            super.list().then(([msg, data]) => {
                if (msg) return resolve([msg, []]);
                const service = services.event;
                const promises = data.reduce(
                    (res, item) => {
                        const start = this.getCronTimestamp(item.start, true);
                        const end = this.getCronTimestamp(item.end);
                        if (!start || !end) return res;
                        res.push(
                            new Promise(resolve => {
                                service.Model.countDocuments({
                                    $and: [
                                        { start: { $gte: start } },
                                        { start: { $lte: end } },
                                        { tags: { $in: [item.tag] } }
                                    ]
                                })
                                    .then(count => {
                                        if (count > 0) return resolve(null);
                                        resolve({ ...item, length: new Date().getTime() - end });
                                    })
                                    .catch(e => {
                                        resolve(null);
                                        this.logger.error('list_today', 'fail', e);
                                    });
                            })
                        );
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
