import { GetServerSideProps, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { TopicsList } from "../../../../components/forum/topics/TopicsList";
import { Category, Topic } from "../../../../components/forum/@common/forumTypes";
import AppLayout from "../../../../components/_common/AppLayout";
import { categoriesApi } from "../../../api/categories";
import { categoryApi } from "../../../api/categories/[categoryUid]";
import { topicsApi } from "../../../api/categories/[categoryUid]/topics";

export async function getStaticPaths() {
  const data = await categoriesApi("GET");
  const categories: Category[] = JSON.parse(data);
  const paths = categories.map((category) => ({
    params: { categoryUid: category.uid },
  }));

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const dataCategory = await categoryApi(params.categoryUid as string, "GET");
  const category = JSON.parse(dataCategory);
  const dataTopics = await topicsApi(params.categoryUid as string, "GET", null);
  const topics = JSON.parse(dataTopics);
  return { props: { category, topics } };
};

type Props = {
  topics: Topic[];
  category: Category;
};

export const Topics = ({ category, topics }: Props) => {
  return (
    <AppLayout>
      <TopicsList topics={topics} category={category}></TopicsList>
    </AppLayout>
  );
};

export default Topics;
