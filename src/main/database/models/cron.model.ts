import { model as Model, Schema } from 'mongoose';
import { ICronModel } from '@contracts/interface';

export const name = 'Cron';

const schema = new Schema<ICronModel>(
    {
        // 提醒内容
        msg: { type: String, required: true },
        // 标签
        tag: { type: String, required: true },
        // 开始规则
        start: { type: String, required: false },
        // 结束规则
        end: { type: String, required: false },
        // 主题
        topic: { type: String, required: false }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
