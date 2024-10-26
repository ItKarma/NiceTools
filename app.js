import express from 'express';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import cookieParser from 'cookie-parser';
import connection_db from './config/database.js';
import router from './routes.js';
import cors from 'cors';
import path from 'path'

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  try {
    await connection_db();

    app.use(cors({
      origin: 'domain',
      credentials: true
    }));
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.set('views', resolve(__dirname, 'src', 'views'));
    app.set('view engine', 'ejs');
    app.use('/assets', express.static(resolve(__dirname, 'src', 'views', 'assets')));

    app.use(logger('dev'));
    app.use(router);

    app.use((req, res, next) => {
      res.status(404).sendFile(path.join(__dirname, 'src', 'views', 'assets', 'images', '404.png'));
    });

    app.listen(3000, () => {
      console.log("Servidor online na porta 3000");
    });
  } catch (err) {
    console.log(err)
  }
})();
