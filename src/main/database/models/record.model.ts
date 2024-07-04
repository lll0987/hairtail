import { model as Model, Schema } from 'mongoose';
import { IRecord } from '@t/interface';
import { eventName, infoName } from '.';

export const name = 'Record';

const schema = new Schema<IRecord>(
    {
        in: { type: String, required: true },
        out: { type: String, required: true },
        e: [{ type: Schema.Types.ObjectId, ref: eventName, required: false }],
        i: [{ type: Schema.Types.ObjectId, ref: infoName, required: false }]
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
