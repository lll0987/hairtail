import { model as Model, Schema } from 'mongoose';

export const name = 'Info';

const schema = new Schema(
    {
        name: { type: String },
        att: { type: String },
        remark: { type: String }
    },
    { collection: name }
);

export const model = Model(name, schema);
