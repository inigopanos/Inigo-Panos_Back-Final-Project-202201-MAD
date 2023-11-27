import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export async function mongoConnect() {
    const userName = process.env.DBUSER;
    const password = process.env.DBPASSWD;
    let dbName;
    if (process.env.NODE_ENV === 'test') {
        dbName = process.env.DBNAMETEST;
        console.log('Nombre DB:', dbName);
    } else {
        dbName = process.env.DBNAME;
        console.log('Nombre DB:', dbName);
    }

    const uri = `mongodb+srv://${userName}:${password}@cluster0.piemq.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    const mongooseConnect = await mongoose.connect(uri);
    return mongooseConnect;
}
export async function mongoDisconnect() {
    return mongoose.disconnect();
}
