import { NextApiRequest, NextApiResponse } from "next";
import { getSession, Session } from "next-auth/client";
import { Pool, QueryResult } from "pg";
import { Category, Topic } from "../../../../../components/forum/@common/forumTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const {
    query: { categoryUid },
  } = req;
  if (session) {
    const data = await topicsApi(categoryUid as string, req.method, req.body && JSON.parse(req.body), session);
    return res.status(200).send(data);
  } else {
    res.status(401).send([]);
  }
  res.end();
}

export const topicsApi = async (categoryUid: string, method: string, body?: Record<string, any>, session?: Session) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Topic>;
  const category = await client.query<Category>(`select * from forum_categories where uid = '${categoryUid}'`);
  try {
    await client.query("BEGIN");
    if (method === "GET") {

      response = await client.query<Topic>(`select * from forum_topics where categoryid = ${category.rows[0].id}`);
    } else if (method === "POST") {
      const userId = await client.query(`select id from users where email = '${session.user.email}'`);
      const addTopic = `insert into forum_topics (title, description, userid, categoryid) values('${body.title}', '${body.description}', ${userId.rows[0].id}, ${category.rows[0].id})`;
      response = await client.query(addTopic);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
  return JSON.stringify(response.rows);
};
