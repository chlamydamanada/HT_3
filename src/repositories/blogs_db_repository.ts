import { blogsCollection } from "./db";
import { ObjectId } from "mongodb";

type BlogViewType = {
  id: string;
  websiteUrl: string;
  description: string;
  name: string;
  createdAt: string;
};

export const blogsRepository = {
  /*async findBlogs() {
    const allBlogs = await blogsCollection.find({}).toArray();
    return allBlogs.map((b) => ({
      id: b._id,
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
    }));
  },
  async findBlog(id: string): Promise<BlogViewType | null> {
    let blog = await blogsCollection.findOne({ id: id });
    if (!blog) {
      return null;
    }
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    };
  },*/
  async deleteBlog(id: string) {
    const isDel = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return isDel.deletedCount === 1;
  },
  async createBlog(blog: any) {
    const newBlog = await blogsCollection.insertOne(blog);
    return {
      id: newBlog.insertedId.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
    };
  },
  async updateBlog(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ) {
    const newBlog = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
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
