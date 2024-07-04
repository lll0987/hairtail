/* eslint-disable @typescript-eslint/no-explicit-any */

import mongodb from 'mongodb';
import { Model } from 'mongoose';
import { Logger } from '../../logger';
import { connect } from './db';
import { MsgType, ResType } from '@t/types';

export class BaseService {
    protected model;
    protected logger;

    constructor(name: string, model: Model<any>) {
        this.model = model;
        this.logger = new Logger(`${name}Service`);
    }

    protected connect() {
        return new Promise<ResType<boolean>>(resolve => {
            connect()
                .then(() => {
                    resolve([null, true]);
                })
                .catch(error => {
                    this.logger.error('fail', error);
                    resolve(['数据库连接失败', null]);
                });
        });
    }

    async list() {
        const [msg] = await this.connect();
        return new Promise<[MsgType | null, any[]]>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .find()
                .lean()
                .then(r => {
                    const list = r.map(({ _id, ...doc }) => {
                        const objectId = _id as mongodb.ObjectId;
                        return { ...doc, id: objectId.toString() };
                    });
                    this.logger.info('success', list);
                    resolve([null, list]);
                })
                .catch(e => {
                    this.logger.error('fail', e);
                    resolve(['查询失败', []]);
                });
        });
    }

    async create(data: any) {
        const [msg] = await this.connect();
        return new Promise<ResType<string>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .create(data)
                .then(r => {
                    this.logger.info('success', r);
                    resolve([null, r._id]);
                })
                .catch(e => {
                    this.logger.error('fail', e);
                    resolve(['保存失败', null]);
                });
        });
    }

    async updateById(id: string, data: any) {
        const [msg] = await this.connect();
        return new Promise<ResType<string>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findByIdAndUpdate(id, data)
                .then(r => {
                    this.logger.info('success', r);
                    resolve([null, r._id]);
                })
                .catch(e => {
                    this.logger.error('fail', e);
                    resolve(['更新失败', null]);
                });
        });
    }

    async deleteById(id: string) {
        const [msg] = await this.connect();
        return new Promise<ResType<string>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findByIdAndDelete(id)
                .then(r => {
                    this.logger.info('success', r);
                    resolve([null, r._id]);
                })
                .catch(e => {
                    this.logger.error('fail', e);
                    resolve(['删除失败', null]);
                });
        });
    }
}
