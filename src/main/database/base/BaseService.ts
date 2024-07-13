/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model } from 'mongoose';
import { Logger } from '../../logger';
import { connect } from './db';
import { MsgType, ObjectId, ResType } from '@t/types';

export class BaseService {
    protected model;
    protected logger;

    constructor(name: string, model: Model<any>) {
        this.model = model;
        this.logger = new Logger(`${name}Service`);
    }

    // 建立数据库连接
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

    // 列表查询
    async list() {
        const [msg] = await this.connect();
        return new Promise<[MsgType | null, any[]]>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .find()
                .lean()
                .then(r => {
                    const list = r.map(({ _id, ...doc }) => {
                        const objectId = _id as ObjectId;
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

    // 根据 id 查询数据
    async findById(id: string) {
        const [msg] = await this.connect();
        return new Promise<ResType<any>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findById(id)
                .then(r => {
                    const { _id, ...obj } = r;
                    this.logger.info('success', obj);
                    resolve([null, { obj, id: _id.toString() }]);
                })
                .catch(e => {
                    this.logger.error('fail', e);
                    resolve(['查询失败', null]);
                });
        });
    }

    // 插入数据
    async create(data: any) {
        const [msg] = await this.connect();
        return new Promise<ResType<ObjectId | ObjectId[]>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .create(data)
                .then(r => {
                    this.logger.info('success', r);
                    resolve([null, Array.isArray(data) ? r.map(i => i._id) : r._id]);
                })
                .catch(e => {
                    this.logger.error('fail', e);
                    resolve(['保存失败', null]);
                });
        });
    }

    // 根据 id 更新数据
    async updateById(id: string, data: any) {
        const [msg] = await this.connect();
        return new Promise<ResType<ObjectId>>(resolve => {
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

    // 根据 id 删除数据
    async deleteById(id: string) {
        const [msg] = await this.connect();
        return new Promise<ResType<ObjectId>>(resolve => {
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
