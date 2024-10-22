
import mongoose from'mongoose';
import { dbURL } from './config.ts';
import chalk from 'chalk';

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbURL!);
        console.log(`${chalk.green.bold.italic('Connected Successfully to MongoDB')}`);
    } catch (e) {
        console.log(`${chalk.red('Error connecting to MongoDB')}`, e);
        process.exit(1);
    }
};


export default connectDB;

