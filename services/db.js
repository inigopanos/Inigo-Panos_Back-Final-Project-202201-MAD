import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export async function mongoConnect() {
   
    let DBName;
    if (process.env.NODE_ENV === 'test') {
        DBName = process.env.DBNAMETEST;
    } else {
        DBName = process.env.dbName;
    }
    const userName = process.env.userName;
    const password = process.env.password;
   
    const uri = `mongodb+srv://${userName}:${password}@cluster0.piemq.mongodb.net/${DBName}?retryWrites=true&w=majority`;

    const mongooseConnect = await mongoose.connect(uri);
    return mongooseConnect;
}
export async function mongoDisconnect() {
    return mongoose.disconnect();
}
