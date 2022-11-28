let blogs = [
  {
    id: "1",
    name: "Nick",
    description: "valid string",
    websiteUrl: "https://haha",
  },
  {
    id: "2",
    name: "Bob",
    description: "valid string",
    websiteUrl: "https://hey",
  },
];

export const blogsRepository = {
  async findBlogs() {
    return blogs;
  },
  async findBlog(id: string) {
    let blog = blogs.find((b) => b.id === id);
    return blog;
  },
  async deleteBlog(id: string) {
    blogs = blogs.filter((blog) => blog.id !== id);
    return blogs;
  },
  async createBlog(name: any, description: any, websiteUrl: any) {
    const newBlog = {
      id: +new Date() + "",
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    };
    blogs.push(newBlog);
    return newBlog;
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const newBlog = blogs.find((b) => b.id === id);
    if (newBlog) {
      (newBlog.name = name),
        (newBlog.description = description),
        (newBlog.websiteUrl = websiteUrl);
      return newBlog;
    }
  },
  async deleteAllBlogs() {
    blogs.splice(0, blogs.length);
    return true;
  },
};
