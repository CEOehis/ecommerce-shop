import '@babel/polyfill';
import express from 'express';
import expressWinston from 'express-winston';
import winston from 'winston';
import morgan from 'morgan';
import log from 'fancy-log';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectSession from 'connect-session-sequelize';
import router from './routes';
import { sequelize } from './database/models';

const SequelizeStore = connectSession(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
  expiration: 10 * 1000,
});

const app = express();
app.use(
  session({
    secret: 'awesome secretive secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
  })
);
sessionStore.sync();
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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Resource does not exist');
  err.status = 404;
  next(err);
});

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    log(err.stack);
    res.status(err.status || 500).json({
      error: {
        message: err.message,
        error: err,
      },
      status: false,
    });
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  return res.status(err.status || 500).json({
    error: {
      message: err.message,
      error: {},
    },
    status: false,
  });
});

// configure port and listen for requests
const port = parseInt(process.env.NODE_ENV === 'test' ? 8378 : process.env.PORT, 10) || 5000;
export const server = app.listen(port, () => {
  log(`Server is running on http://localhost:${port} 🚀🚀🚀`);
});

export default app;
