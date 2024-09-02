import { FilterQuery, Model, Types } from 'mongoose';
import { TResponse, TDoc } from '@contracts/type';
import { Logger } from '../../logger';
import { connect } from './db';

export class BaseService<T> {
    protected model: Model<T>;
    protected logger: Logger;

    constructor(name: string, model: Model<T>) {
        this.model = model;
        this.logger = new Logger(`${name}Service`);
    }

    get Model() {
        return this.model;
    }

    // 建立数据库连接
    protected connect() {
        return new Promise<TResponse<boolean>>(resolve => {
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
    async list(filter: FilterQuery<T> = {}) {
        const [msg] = await this.connect();
        return new Promise<TResponse<TDoc<T>, true>>(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .find(filter)
                .lean()
                .then(docs => {
                    const data = docs.map(({ _id, ...doc }) => ({
                        ...doc,
                        id: (_id as Types.ObjectId).toString()
                    })) as TDoc<T>[];
                    this.logger.info('list', 'success', data);
                    resolve([null, data]);
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
        return new Promise<TResponse<TDoc<T>>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findById(id)
                .lean()
                .then(doc => {
                    if (doc) {
                        const { _id, ...item } = doc;
                        const data = { ...item, id: (_id as Types.ObjectId).toString() } as TDoc<T>;
                        this.logger.info('findById', 'success', data);
                        resolve([null, data]);
                    } else {
                        this.logger.error('findById', 'null', id);
                        resolve(['没有查询到相关记录', null]);
                    }
                })
                .catch(e => {
                    this.logger.error('findById', 'fail', e);
                    resolve(['查询失败', null]);
                });
        });
    }

    // 插入数据
    create(doc: T): Promise<TResponse<Types.ObjectId>>;
    create(docs: T[]): Promise<TResponse<Types.ObjectId, true>>;
    async create(docs: T | T[]) {
        const [msg] = await this.connect();
        return new Promise(resolve => {
            if (msg) return resolve([msg, []]);
            this.model
                .create(docs)
                .then(result => {
                    let data: Types.ObjectId | Types.ObjectId[];
                    if (Array.isArray(result)) {
                        data = result.map(({ _id }) => _id) as Types.ObjectId[];
                    } else {
                        data = result._id as Types.ObjectId;
                    }
                    this.logger.info('create', 'success', data);
                    resolve([null, data]);
                })
                .catch(e => {
                    this.logger.error('create', 'fail', e);
                    resolve(['保存失败', null]);
                });
        });
    }

    // 根据 id 更新数据
    async updateById(id: string, doc: Partial<T>) {
        const [msg] = await this.connect();
        return new Promise<TResponse<Types.ObjectId>>(resolve => {
            if (msg) return resolve([msg, null]);
            const _doc = { ...doc, _id: undefined };
            this.model
                .findByIdAndUpdate(id, _doc)
                .then(result => {
                    if (result) {
                        const data = result._id as Types.ObjectId;
                        this.logger.info('updateById', 'success', data);
                        resolve([null, data]);
                    } else {
                        this.logger.error('updateById', 'null', id);
                        resolve(['没有相关记录', null]);
                    }
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
        return new Promise<TResponse<Types.ObjectId>>(resolve => {
            if (msg) return resolve([msg, null]);
            this.model
                .findByIdAndDelete(id)
                .then(doc => {
                    if (doc) {
                        const data = doc._id as Types.ObjectId;
                        this.logger.info('deleteById', 'success', data);
                        resolve([null, data]);
                    } else {
                        this.logger.error('deleteById', 'null', id);
                        resolve(['没有相关记录', null]);
                    }
                })
                .catch(e => {
                    this.logger.error('deleteById', 'fail', e);
                    resolve(['删除失败', null]);
                });
        });
    }
}
