import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export async function mongoConnect() {
   
    let dbName;
    if (process.env.NODE_ENV === 'test') {
        dbName = process.env.DBNAMETEST;
    } else {
        dbName = process.env.DBNAME;
    }
    const userName = process.env.DBUSER;
    const password = process.env.DBPASSWD;
   
    const uri = `mongodb+srv://${userName}:${password}@cluster0.piemq.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    
    const mongooseConnect = await mongoose.connect(uri);
    return mongooseConnect;
}
export async function mongoDisconnect() {
    return mongoose.disconnect();
}
