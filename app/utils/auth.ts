import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import jwt from 'jsonwebtoken';
import { getRequestContext, CloudflareEnv } from '../types/cloudflare.d';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface ExtendedNextApiRequest extends NextApiRequest {
  userId?: number;
}

export const authMiddleware = (handler: NextApiHandler) => async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const ctx = getRequestContext();
    req.userId = ctx.env.USER_ID = decoded.userId;
    return handler(req, res);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};