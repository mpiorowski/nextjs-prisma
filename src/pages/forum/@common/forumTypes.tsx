
export type Topic = {
  id?: string;
  uid?: string;
  title: string;
  description?: string;
  views: string;
  categoryid: string;
  userid: string;
};

export type Post = {
  id?: string;
  uid?: string;
  content: string;
  replyid?: string;
  topicid: string;
  userid: string;
};
