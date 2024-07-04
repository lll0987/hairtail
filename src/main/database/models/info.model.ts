import { model as Model, Schema } from 'mongoose';

export const name = 'Info';

const schema = new Schema(
    {
        name: { type: String, require: true },
        att: { type: String, require: false },
        remark: { type: String, require: false }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
