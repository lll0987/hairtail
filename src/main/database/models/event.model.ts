import { model as Model, Schema } from 'mongoose';
import { infoName } from '.';

export const name = 'Event';

const schema = new Schema(
    {
        start: { type: Number, required: true },
        end: { type: Number, required: true },
        grain: { type: Number, require: true, index: true },
        title: { type: String, required: false },
        value: { type: Number, required: false },
        remark: { type: String, required: false },
        infos: [{ type: Schema.Types.ObjectId, ref: infoName, required: false }]
    },
    { collection: name }
);

export const model = Model(name, schema);
