import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import morgan from 'morgan';
import log from 'fancy-log';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import router from './routes';

const app = express();
app.use(morgan('dev'));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(expressValidator());

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    meta: false,
    expressFormat: true,
    colorize: true,
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  })
);

app.use(router);

app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    meta: false,
    expressFormat: true,
    colorize: true,
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  })
);

const port = parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) || 5000;
app.listen(port, () => {
  log(`Server is running on http://localhost:${port} 🚀🚀🚀`);
});
