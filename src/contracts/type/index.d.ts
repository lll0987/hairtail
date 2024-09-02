import type { FilterQuery, FlattenMaps, Types } from 'mongoose';
import type { TModuleName, TBaseApiName } from '../../main/database';
import type { EventGrain, TEventGrain, RecordStatus, TRecordStatus } from '../component';
import type {
    ICronModel,
    IEventModel,
    IInfoModel,
    IModel,
    IRecordModel,
    ISettingModel,
    ITagModel,
    ITopicModel
} from '../interface';

export { EventGrain, TEventGrain, RecordStatus, TRecordStatus, TModuleName, TBaseApiName };

export type TDoc<T> = FlattenMaps<T> & IModel;
export type TResponse<T, isArray = false> = isArray extends true
    ? [string | null, Array<T>]
    : [string, null] | [null, T];

export type TModel<M extends TModuleName> = M extends 'cron'
    ? ICronModel
    : M extends 'event'
      ? IEventModel
      : M extends 'info'
        ? IInfoModel
        : M extends 'record'
          ? IRecordModel
          : M extends 'setting'
            ? ISettingModel
            : M extends 'tag'
              ? ITagModel
              : M extends 'topic'
                ? ITopicModel
                : never;

// 数据库接口
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
export type TApiRequest<M extends TModuleName, N = TApiName<M>, T = TModel<M>> = N extends 'list'
    ? [] | [FilterQuery<T>]
    : N extends 'add'
      ? [T | Array<T>]
      : N extends 'update'
        ? [string, Partial<T>]
        : N extends 'remove'
          ? [string]
          : [];

// 数据库响应类型
export type TApiResponse<M extends TModuleName, N = TApiName<M>, T = TModel<M>> = N extends 'list'
    ? TResponse<TDoc<T>, true>
    : N extends 'add'
      ? TResponse<Types.ObjectId> | TResponse<Types.ObjectId, true>
      : N extends 'update'
        ? TResponse<Types.ObjectId>
        : N extends 'remove'
          ? TResponse<Types.ObjectId>
          : T;

// 线程通信名称
export type TDbApiName<M extends TModuleName> = `db:${M}:${TApiName<M>}`;
