import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import { Pool, QueryResult } from 'pg';
import { Category } from '../forum/@common/forumTypes';

export async function dbGetAllCategories() {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Category> | null = null;
  response = await client.query(`select * from forum_categories`);
  return response.rows;
}

export default async function categoriesApi(req: NextApiRequest, res: NextApiResponse) {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Category> | null = null;
  try {
    console.log('categories request api');
    const session = await getSession({ req });
    const method = req.method;
    if (session?.user) {
      await client.query('BEGIN');
      if (method === 'GET') {
        response = await client.query(`select * from forum_categories`);
      } else if (method === 'POST') {
        const category = JSON.parse(req.body) as Category;
        const userId = await client.query(`select id from users where email = '${session.user.email}'`);
        const addCategory = `insert into forum_categories (title, description, userid, icon) values('${category.title}', '${category.description}', ${userId.rows[0].id}, 'test')`;
        response = await client.query(addCategory);
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
    return res.json(response.rows);
  } else {
    return res.status(404).json({ message: 'Something went wrong 2' });
  }
}