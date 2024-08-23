import { Types } from 'mongoose';
import type { IModel } from './interface';

// 数据库模块
export type TModuleName = 'cron' | 'event' | 'info' | 'record' | 'setting' | 'tag' | 'topic';

// 数据库接口
export type TBaseApiName = 'add' | 'list' | 'remove' | 'update';
export type TCronApiName = TBaseApiName | 'list:today';
export type TEventApiName = TBaseApiName | 'list:color';
export type TRecordApiName = TBaseApiName | 'list:today';
export type TApiName<M extends TModuleName> = M extends 'cron'
    ? TCronApiName
    : M extends 'event'
      ? TEventApiName
      : M extends 'record'
        ? TRecordApiName
        : TBaseApiName;

// 数据库请求类型
export type TApiRequest<T extends IModel> = [] | [T | Array<T>] | [string] | [string, T];

// 数据库响应类型
export type TApiResponse<T> = T extends Array<IModel> ? [string | null, T] : [string | null, null | T];

// 线程通信名称
export type TDbApiName<M extends TModuleName> = `db:${M}:${TApiName<M>}`;

// 线程通信接口
export type TIpcDbApi<M extends TModuleName, T extends IModel, R extends IModel | Types.ObjectId> = (
    name: TDbApiName<M>,
    ...args: TApiRequest<T>
) => Promise<TApiResponse<R | Array<R>>>;
