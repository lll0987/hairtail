import { model as Model, Schema } from 'mongoose';
import { ISettingModel } from '@contracts/interface';

export const name = 'Setting';

const schema = new Schema<ISettingModel>(
    {
        label: { type: String, required: true },
        value: { type: Object, required: true }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
