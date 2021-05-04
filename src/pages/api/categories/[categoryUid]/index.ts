import { NextApiRequest, NextApiResponse } from "next";
import { getSession, Session } from "next-auth/client";
import { Pool, QueryResult } from "pg";
import { Category } from "../../../forum/@common/forumTypes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  const {
    query: { categoryUid },
  } = req;
  if (session) {
    const data = await categoryApi(categoryUid as string, req.method, req.body && JSON.parse(req.body), session);
    return res.status(200).send(data);
  } else {
    res.status(401).send([]);
  }
  res.end();
}

export const categoryApi = async (
  categoryUid: string,
  method: string,
  body?: Record<string, any>,
  session?: Session
) => {
  const pool = new Pool();
  const client = await pool.connect();
  let response: QueryResult<Category>;
  try {
    await client.query("BEGIN");
    if (method === "GET") {
      response = await client.query(`select * from forum_categories where uid = '${categoryUid}'`);
      console.log(response.rows);
    }
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
  return JSON.stringify(response.rows[0]);
};
