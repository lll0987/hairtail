import { model as Model, Schema } from 'mongoose';
import { eventName, infoName, tagName, topicName } from '.';
import { RecordModel } from '@t/interface';

export const name = 'Record';

const schema = new Schema<RecordModel>(
    {
        in: { type: String, required: true },
        out: { type: String, required: true },
        event: [{ type: Schema.Types.ObjectId, ref: eventName, required: false }],
        info: [{ type: Schema.Types.ObjectId, ref: infoName, required: false }],
        tag: [{ type: Schema.Types.ObjectId, ref: tagName, required: false }],
        topic: [{ type: Schema.Types.ObjectId, ref: topicName, required: false }]
    },
    { collection: name, timestamps: true }
);

export const model = Model(name, schema);
