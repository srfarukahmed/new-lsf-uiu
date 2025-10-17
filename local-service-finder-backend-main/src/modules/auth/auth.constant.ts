export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
};
