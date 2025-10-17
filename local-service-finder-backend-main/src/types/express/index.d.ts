import { CustomJwtPayload } from '@src/types/custom-jwt';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Request {
      user?: CustomJwtPayload; // or the exact decoded token type
    }
  }
}
