import { model as Model, Schema } from 'mongoose';
import { eventName, infoName, tagName, topicName } from '.';
import { IRecordModel } from '@contracts/interface';

export const name = 'Record';

const schema = new Schema<IRecordModel>(
    {
        in: { type: String, required: true },
        out: { type: String, required: true },
        status: { type: Number, required: true },
        event: [{ type: Schema.Types.ObjectId, ref: eventName, required: false }],
        info: [{ type: Schema.Types.ObjectId, ref: infoName, required: false }],
        tag: [{ type: Schema.Types.ObjectId, ref: tagName, required: false }],
        topic: [{ type: Schema.Types.ObjectId, ref: topicName, required: false }]
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
