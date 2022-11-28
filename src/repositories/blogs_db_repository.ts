import { blogsCollection } from "./db";

export const blogsRepository = {
  async findBlogs() {
    return await blogsCollection
      .find({}, { projection: { _id: false } })
      .toArray();
  },
  async findBlog(id: string) {
    let blog = await blogsCollection.findOne(
      { id: id },
      { projection: { _id: false } }
    );
    return blog;
  },
  async deleteBlog(id: string) {
    const isDel = await blogsCollection.deleteOne({ id: id });
    return isDel.deletedCount === 1;
  },
  async createBlog(name: string, description: string, websiteUrl: string) {
    const newBlog = {
      id: +new Date() + "",
      name: name,
      description: description,
      websiteUrl: websiteUrl,
      createdAt: new Date().toISOString(),
    };
    await blogsCollection.insertOne(newBlog);
    return newBlog;
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const newBlog = await blogsCollection.updateOne(
      { id: id },
      {
        $set: {
          name: name,
          description: description,
          websiteUrl: websiteUrl,
        },
      }
    );
    return newBlog.matchedCount === 1;
  },
};
