import { NextApiRequest, NextApiResponse } from "next";
import { getSession, Session } from "next-auth/client";
import { Pool, QueryResult } from "pg";
import { Category, Post, Topic } from "../../../../../forum/@common/forumTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const {
    query: { topicUid },
  } = req;
  if (session) {
    const data = await topicApi(topicUid as string, req.method, req.body && JSON.parse(req.body), session);
    return res.status(200).send(data);
  } else {
    res.status(401).send([]);
  }
  res.end();
}

export const topicApi = async (topicUid: string, method: string, body?: Record<string, any>, session?: Session) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Topic>;
  try {
    await client.query("BEGIN");
    if (method === "GET") {
      response = await client.query<Topic>(`select * from forum_topics where uid = '${topicUid}'`);
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
