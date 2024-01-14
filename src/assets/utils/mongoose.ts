import type { ConnectOptions } from 'mongoose';
import mongoose from 'mongoose';

// Create interface for connections options
interface DbConnectOptions extends ConnectOptions {
    autoIndex: boolean;
    connectTimeoutMS: number;
    family: number;
    maxPoolSize: number;
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
}

export const dbConnect = {
    init: async () => {
        const options: DbConnectOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            connectTimeoutMS: 100_000,
            maxPoolSize: 100,
            family: 4,
        };
        await mongoose.connect(
            `mongodb+srv://PhantHive:${process.env.VITE_MONGO_DB}@iris.txxhe.mongodb.net/`,
            options,
        );

        mongoose.Promise = global.Promise; // eslint-disable-line require-atomic-updates

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB!');
        });

        mongoose.connection.on('error', (error: any) => {
            console.error('MongoDB Connection Error: ', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('Disconnected from MongoDB');
        });
    },
};
