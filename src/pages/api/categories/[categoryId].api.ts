import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Pool, QueryResult } from 'pg';
import { Category } from '../../forum/@common/forumTypes';

export default async function categoriesApi(req: NextApiRequest, res: NextApiResponse) {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Category> | null = null;
  const {
    query: { categoryId },
  } = req;
  try {
    const session = await getSession({ req });
    const method = req.method;
    if (session?.user) {
      await client.query('BEGIN');
      if (method === 'GET') {
        response = await client.query(`select * from forum_categories where uid = '${categoryId}'`);
      }
      await client.query('COMMIT');
    } else {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (e) {
    console.error(e);
    await client.query('ROLLBACK');
    return res.status(404).json({ message: e.message });
  } finally {
    client.release();
  }

  if (response) {
    return res.json(response.rows[0]);
  } else {
    return res.status(404).json({ message: 'Something went wrong 2' });
  }
}
