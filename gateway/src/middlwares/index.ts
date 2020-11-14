import cors = require('cors');
import { Response, NextFunction } from 'express';
import { auth } from '../firebase';

export const firebaseAuth = (req: any, res: Response, next: NextFunction) => {
  if (!req.token) {
    return res.sendStatus(401);
  }
  return auth
    .verifyIdToken(req.token)
    .then((decodedToken) => {
      req.userId = decodedToken.uid;
      next();
    })
    .catch(() => res.sendStatus(401));
};

const allowedOrigins = [
  'http://localhost:3000',
  'https://charitydiscount.ro',
  'https://charitydiscount.github.io',
  'https://charitydiscount-test.web.app',
  'https://admin.charitydiscount.ro',
  'https://admin-charitydiscount.web.app',
  'https://admin-charitydiscount-test.web.app',
];
const corsOptions: cors.CorsOptions = {
  optionsSuccessStatus: 200,
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
      return;
    } else {
      const msg =
        'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      callback(new Error(msg), false);
      return;
    }
  },
};

export const corsMw = cors(corsOptions);
