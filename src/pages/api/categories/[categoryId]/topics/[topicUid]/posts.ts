import { NextApiRequest, NextApiResponse } from "next";
import { getSession, Session } from "next-auth/client";
import { Pool, QueryResult } from "pg";
import { Post, Topic } from "../../../../../forum/@common/forumTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const {
    query: { topicUid },
  } = req;
  if (session) {
    const data = await postsApi(topicUid as string, req.method, req.body && JSON.parse(req.body), session);
    return res.status(200).send(data);
  } else {
    res.status(401).send([]);
  }
  res.end();
}

export const postsApi = async (topicUid: string, method: string, body?: Record<string, any>, session?: Session) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Post>;
  const parent = await client.query<Topic>(`select * from forum_topics where uid = '${topicUid}'`);
  try {
    await client.query("BEGIN");
    if (method === "GET") {
      response = await client.query<Post>(`select * from forum_posts where topicid = ${parent.rows[0].id}`);
    } else if (method === "POST") {
      const userId = await client.query(`select id from users where email = '${session.user.email}'`);
      const addPost = `insert into forum_posts (content, userid, topicid) values('${body.content}', ${userId.rows[0].id}, ${parent.rows[0].id})`;
      response = await client.query(addPost);
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
