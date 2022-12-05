import { blogsRepository } from "../repositories/blogs_db_repository";

type BlogViewType = {
  id: string;
  websiteUrl: string;
  description: string;
  name: string;
  createdAt: string;
};

export const blogsService = {
  /*async findBlogs() {
    return await blogsRepository.findBlogs();
  },
  async findBlog(id: string): Promise<BlogViewType | null> {
    return await blogsRepository.findBlog(id);
  },*/
  async deleteBlog(id: string) {
    return await blogsRepository.deleteBlog(id);
  },
  async createBlog(
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<BlogViewType> {
    const newBlog = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    };
    const result = await blogsRepository.createBlog(newBlog);
    return result;
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    return await blogsRepository.updateBlog(id, name, description, websiteUrl);
  },
};
