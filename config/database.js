import mongoose from "mongoose";
import 'dotenv/config';

async function connection_db() {
    await mongoose.connect(process.env.DB_URL).then(() => {
        return console.log('Connected in db')
    }).catch((err) => {
        return console.log(' erro in connection database ', err)
    })
}

export default connection_db