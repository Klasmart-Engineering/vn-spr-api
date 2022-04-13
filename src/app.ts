import { config } from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import createError, { HttpError } from 'http-errors';
import swaggerUi from 'swagger-ui-express';

import indexRouter from './routes';

const app = express();
config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

if (process.env.SHOW_SWAGGER === 'true') {
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/swagger.json',
      },
    })
  );
}

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((_: Request, __: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, _: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(`error ${err.status}: ${err.message}`);
});

export default app;