import { model as Model, Schema } from 'mongoose';
import { SettingModel } from '@t/interface';

export const name = 'Setting';

const schema = new Schema<SettingModel>(
    {
        label: { type: String, required: true },
        value: { type: Object, required: true }
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
