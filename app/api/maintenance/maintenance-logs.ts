import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../utils/db';
import { getRequestContext } from '../../types/cloudflare.d';
import { authMiddleware } from '../../utils/auth';

export const config = {
  runtime: 'edge',
  viewport: {
    viewportWidth: 'device-width',
    viewportInitialScale: 1,
    viewportMinimumScale: 1,
    viewportMaximumScale: 1,
  },
};

type ExtendedNextApiRequest = NextApiRequest & {
  body: {
    ph: number;
    ammonia: number;
    nitrite: number;
    nitrate: number;
    id?: number;
  };
  query: {
    page?: string;
    limit?: string;
    sort?: string;
    order?: string;
  };
};

async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const ctx = getRequestContext();
  const userId = ctx.env.USER_ID;

  if (req.method === 'POST') {
    const { ph, ammonia, nitrite, nitrate } = req.body;

    try {
      await query(
        'INSERT INTO maintenance_logs (user_id, ph, ammonia, nitrite, nitrate) VALUES (?, ?, ?, ?, ?)',
        [userId, ph, ammonia, nitrite, nitrate]
      );
      res.status(201).json({ message: 'Maintenance log created successfully' });
    } catch (error) {
      console.error('Error creating maintenance log:', error);
      res.status(500).json({ error: 'Failed to create maintenance log' });
    }
  } else if (req.method === 'GET') {
    const { page = '1', limit = '10', sort = 'created_at', order = 'DESC' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    try {
      const logs = await query(
        `SELECT * FROM maintenance_logs WHERE user_id = ? ORDER BY ?? ${order} LIMIT ? OFFSET ?`,
        [userId, sort, Number(limit), offset]
      );
      res.status(200).json({ logs, page: Number(page), limit: Number(limit) });
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
      res.status(500).json({ error: 'Failed to fetch maintenance logs' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.body;

    try {
      await query('DELETE FROM maintenance_logs WHERE id = ? AND user_id = ?', [id, userId]);
      res.status(200).json({ message: 'Maintenance log deleted successfully' });
    } catch (error) {
      console.error('Error deleting maintenance log:', error);
      res.status(500).json({ error: 'Failed to delete maintenance log' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default authMiddleware(handler);