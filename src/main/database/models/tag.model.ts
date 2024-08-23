import { model as Model, Schema } from 'mongoose';
import { ITagModel } from '@contracts/interface';

export const name = 'Tag';

const schema = new Schema<ITagModel>(
    {
        name: { type: String, required: true },
        alias: { type: String, required: false },
        color: { type: String, required: true },
        c2: { type: String, required: false }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
