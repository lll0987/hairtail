import { model as Model, Schema } from 'mongoose';
import { infoName, tagName, topicName } from '.';

export const name = 'Event';

const schema = new Schema(
    {
        // 开始时间
        start: { type: Number, required: true },
        // 结束时间
        end: { type: Number, required: true },
        // 颗粒度
        grain: { type: Number, require: true },
        // 主题
        topic: { type: Schema.Types.ObjectId, ref: topicName, require: true },
        // 标题
        title: { type: String, required: false },
        // 值
        value: { type: Number, required: false },
        // 备注
        remark: { type: String, required: false },
        // 标签
        tags: [{ type: Schema.Types.ObjectId, ref: tagName, required: false }],
        // 关联信息
        infos: [{ type: Schema.Types.ObjectId, ref: infoName, required: false }]
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
