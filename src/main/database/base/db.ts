import mongoose from 'mongoose';

import { Logger } from '../../logger';
const logger = new Logger('MongoDB');

const uri = import.meta.env.MAIN_VITE_MONGO_URI;
const dbName = 'hairtail';

export async function connect() {
    try {
        return await mongoose.connect(`${uri}/${dbName}`);
    } catch (error) {
        logger.error(error);
        throw new Error('Failed to connect to MongoDB');
    }
}
