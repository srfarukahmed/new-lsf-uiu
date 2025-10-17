import { JwtPayload } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface CustomJwtPayload extends JwtPayload {
  userId: number;
}
