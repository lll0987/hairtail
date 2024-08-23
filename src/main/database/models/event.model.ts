import { model as Model, Schema } from 'mongoose';
import { infoName } from '.';
import { IEventModel } from '@contracts/interface';

export const name = 'Event';

const schema = new Schema<IEventModel>(
    {
        // 开始时间
        start: { type: Number, required: true },
        // 结束时间
        end: { type: Number, required: true },
        // 颗粒度
        grain: { type: Number, require: true },
        // 主题
        topic: { type: String, require: true, index: true },
        // 标题
        title: { type: String, required: false },
        // 值
        value: { type: Number, required: false },
        // 备注
        remark: { type: String, required: false },
        // 标签
        tags: [{ type: String, required: false, index: true }],
        // 关联信息
        infos: [{ type: Schema.Types.ObjectId, ref: infoName, required: false }]
    },
    { collection: name, timestamps: true }
);

// 为开始时间创建降序索引，提升查询性能
schema.index({ start: -1 });

export const model = Model(name, schema);
