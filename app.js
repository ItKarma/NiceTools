import express from 'express'
import logger from 'morgan'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import connection_db from './config/database.js';

import router from './router.js'
await connection_db()
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('views', resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(logger('tiny'))
app.use(router)

app.listen(3000, ()=> {
    console.log("Servidor online na porta 3000")
})