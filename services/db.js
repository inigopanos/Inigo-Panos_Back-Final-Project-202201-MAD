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
    // const uri = `mongodb+srv://inigopanos:SmkJEOJot1X5Mbrc@cluster0.piemq.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    console.log('Este es el uri:', uri);
    const mongooseConnect = await mongoose.connect(uri);
    return mongooseConnect;
}
export async function mongoDisconnect() {
    return mongoose.disconnect();
}
