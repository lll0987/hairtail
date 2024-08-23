import { model as Model, Schema } from 'mongoose';
import { ITopicModel } from '@contracts/interface';

export const name = 'Topic';

const schema = new Schema<ITopicModel>(
    {
        name: { type: String, required: true },
        color: { type: String, required: true }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
