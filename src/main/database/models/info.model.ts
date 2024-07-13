import { model as Model, Schema } from 'mongoose';
import { InfoModel } from '@t/interface';

export const name = 'Info';

const schema = new Schema<InfoModel>(
    {
        name: { type: String, require: true },
        att: { type: String, require: false },
        remark: { type: String, require: false }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
