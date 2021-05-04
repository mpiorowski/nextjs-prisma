import { Category } from '@prisma/client';
import { REST } from '../../../@common/@enums';
import { apiRequest } from '../../../@common/apiRequest';
import { Post, Topic } from './forumTypes';

export const apiFindAllCategories = () => {
  return apiRequest<Category[]>({
    url: 'http://localhost:3000/api/categories',
    method: REST.GET,
  });
};

export const apiFindCategoryByUid = (categoryUid: string | string[]) => {
  return apiRequest<Category>({
    url: 'http://localhost:3000/api/categories/' + categoryUid,
    method: REST.GET,
  });
};

export const apiAddCategory = (category: Category) => {
  return apiRequest<Category>({
    url: 'http://localhost:3000/api/categories',
    method: REST.POST,
    body: JSON.stringify(category),
  });
};

export const apiFindAllTopics = (categoryUid: string | string[]) => {
  return apiRequest<Topic[]>({
    url: 'http://localhost:3000/api/categories/' + categoryUid + '/topics',
    method: REST.GET,
  });
};

export const apiFindAllPosts = (categoryUid: string | string[], topicUid: string | string[]) => {
  return apiRequest<Post[]>({
    url: 'http://localhost:3000/api/categories/' + categoryUid + '/topics/' + topicUid + '/posts',
    method: REST.GET,
  });
};
