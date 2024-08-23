/* eslint-disable @typescript-eslint/no-explicit-any */

import { Model, Types } from 'mongoose';
import { Logger } from '../../logger';
import { connect } from './db';
import { TApiResponse } from '@contracts/type';

export class BaseService {
    protected model;
    protected logger;

    constructor(name: string, model: Model<any>) {
        this.model = model;
        this.logger = new Logger(`${name}Service`);
    }

    // 建立数据库连接
    protected connect() {
        return new Promise<TApiResponse<boolean>>(resolve => {
            connect()
                .then(() => {
                    resolve([null, true]);
                })
                .catch(error => {
                    this.logger.error('connect', 'fail', error);
                    resolve(['数据库连接失败', null]);
                });
        });
    }

    // 列表查询
    async list(match: object = {}) {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<any>>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .aggregate([{ $match: match }, { $addFields: { id: { $toString: '$_id' } } }])
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

    // 根据 id 查询数据
    async findById(id: string) {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<any>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findById(id)
                .lean()
                .then(({ _id, ...doc }) => {
                    const item = { ...doc, id: _id.toString() };
                    this.logger.info('findById', 'success', item);
                    resolve([null, item]);
                })
                .catch(e => {
                    this.logger.error('findById', 'fail', e);
                    resolve(['查询失败', null]);
                });
        });
    }

    // 插入数据
    async create(data: any) {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<Types.ObjectId | Types.ObjectId[]>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .create(data)
                .then(r => {
                    const ids = Array.isArray(r) ? r.map(i => i._id) : r._id;
                    this.logger.info('create', 'success', r);
                    resolve([null, ids]);
                })
                .catch(e => {
                    this.logger.error('create', 'fail', e);
                    resolve(['保存失败', null]);
                });
        });
    }

    // 根据 id 更新数据
    async updateById(id: string, data: any) {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<Types.ObjectId>>(resolve => {
            if (msg) return resolve([msg, null]);
            data._id = undefined;
            this.model
                .findByIdAndUpdate(id, data)
                .then(r => {
                    this.logger.info('updateById', 'success', r);
                    resolve([null, r._id]);
                })
                .catch(e => {
                    this.logger.error('updateById', 'fail', e);
                    resolve(['更新失败', null]);
                });
        });
    }

    // 根据 id 删除数据
    async deleteById(id: string) {
        const [msg] = await this.connect();
        return new Promise<TApiResponse<Types.ObjectId>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findByIdAndDelete(id)
                .then(r => {
                    this.logger.info('deleteById', 'success', r);
                    resolve([null, r._id]);
                })
                .catch(e => {
                    this.logger.error('deleteById', 'fail', e);
                    resolve(['删除失败', null]);
                });
        });
    }
}
