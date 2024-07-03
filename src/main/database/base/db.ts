import mongoose from 'mongoose';

import { Logger } from '../../logger';
const logger = new Logger('MongoDB');

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'hairtail';

export async function connect() {
    try {
        return await mongoose.connect(`${uri}/${dbName}`);
    } catch (error) {
        logger.error(error);
    }
}
