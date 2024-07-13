import { model as Model, Schema } from 'mongoose';
import { TagModel } from '@t/interface';

export const name = 'Tag';

const schema = new Schema<TagModel>(
    {
        name: { type: String, required: true },
        alias: { type: String, required: false },
        color: { type: String, required: true }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
