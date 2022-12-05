import { postsRepository } from "../repositories/posts_db_repository";

export const postsService = {
  async deletePost(id: string) {
    return await postsRepository.deletePost(id);
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    const newPost = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    return await postsRepository.createPost(newPost);
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    return await postsRepository.updatePost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
  },
};
