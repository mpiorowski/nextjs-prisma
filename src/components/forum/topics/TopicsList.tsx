import Icon from "@ant-design/icons";
import { Button, Dropdown, Menu, Table } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { apiFindAllTopics } from "../../../pages/forum/@common/forumApis";
import { Category, Topic } from "../../../pages/forum/@common/forumTypes";
import { TopicDrawer } from "./TopicDrawer";

interface Props {
  category: Category;
  topics: Topic[];
}

export const TopicsList = ({ category, topics }: Props) => {
  const router = useRouter();
  const [drawerVisibility, setDrawerVisibility] = useState(false);

  const { data } = useQuery(["topics", category.uid], () => apiFindAllTopics(category.uid), { initialData: topics });

  console.log("category", category);
  console.log("topics", topics);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "tTitle",
      sorter: (a, b) => a.topicTitle.localeCompare(b.topicTitle),
      // render: (text, row, index) => {
      // return <NavLink to={"/forum/categories/" + categoryUid + "/topics/" + row.uid + "/posts"}>{text}</NavLink>;
      // },
    },
    // {
    //   title: "Posty",
    //   dataIndex: "postsCount",
    //   key: "postsCount",
    //   sorter: (a, b) => a.postsCount - b.postsCount,
    // },
    // {
    //   title: "Najnowszy",
    //   dataIndex: "latestPostDate",
    //   key: "newest",
    //   sorter: (a, b) => {
    //     // let startDate = a.latestPostDate ? moment(a.latestPostDate) : moment(0);
    //     // let endDate = b.latestPostDate ? moment(b.latestPostDate) : moment(0);
    //     // return startDate.diff(endDate);
    //   },
    //   render: (text, row, index) => {
    //     return text
    //       ? ""
    //       : // <NavLink
    //         //   to={"/forum/categories/" + categoryUid + "/topics/" + row.uid + "/posts?latest=" + row.latestPostUid}
    //         // >
    //         //   {moment(text).fromNow()}
    //         // </NavLink>
    //         "Brak postów";
    //   },
    // },
  ];

  return (
    <div>
      {/*//todo - edit category only for author*/}
      <div className={"topic-header"}>
        <div className={"topic-header-text"}>
          <div style={{ color: "black" }}>{category.title}</div>
          <div className={"topic-header-description"}>{category.description}</div>
          <Button onClick={() => setDrawerVisibility(true)}>Add topic</Button>
        </div>
        <Dropdown
          placement="bottomRight"
          trigger={["click"]}
          overlay={
            <Menu>
              <Menu.Item
                onClick={() => {
                  // editCategory(category)
                }}
                key="1"
              >
                Edytuj
              </Menu.Item>
            </Menu>
          }
        >
          <Button className={"topic-more-btn"} type={"link"}>
            <Icon type="more" />
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        size="middle"
        onRow={(record: Topic, rowIndex) => {
          return {
            onClick: (event) => {
              router.push("/forum/categories/" + category.uid + "/topics/" + record.uid + "/posts");
              // console.log("TUTAJ");
            }, // click row
          };
        }}
        // loading={loading}
        className={"topic-table"}
        rowKey={(record) => record.uid}
        // pagination={{ pageSize: paginationSize }}
      />
      <TopicDrawer
        drawerVisibility={drawerVisibility}
        setDrawerVisibility={setDrawerVisibility}
        categoryUid={category.uid}
      ></TopicDrawer>
    </div>
  );
};
