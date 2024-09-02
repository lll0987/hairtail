import { model as Model, Schema } from 'mongoose';
import { IInfoModel } from '@contracts/interface';

export const name = 'Info';

const schema = new Schema<IInfoModel>(
    {
        name: { type: String, require: true },
        atta: { type: String, require: false },
        remark: { type: String, require: false },
        value: { type: Number, require: false },
        tag: { type: String, require: false },
        min: { type: Number, require: false },
        total: { type: Number, require: false }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
