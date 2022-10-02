const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require('./utils/appError');
const httpStatusCodes = require('./utils/httpStatusCodes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const authRoute = require('./routes/authRoute');

const app = express();

if (process.env.NODE_ENV !== 'production') morgan('dev');

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5000'],
  })
);

app.use(express.json({ limit: '10kb' }));

app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(`${__dirname}/../client/build`));

app.use('/api/v1/auth', authRoute);

app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Cannot find ${req.url} on this server`,
      httpStatusCodes.NOT_FOUND
    )
  );
});

app.use(errorMiddleware);

module.exports = app;
