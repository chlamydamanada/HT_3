import { blogsCollection, postsCollection } from "./db";
import { ObjectId } from "mongodb";

type BlogViewType = {
  id: string;
  websiteUrl: string;
  description: string;
  name: string;
  createdAt: string;
};

export const blogsQwRepository = {
  async findBlogs(
    searchNameTerm: String | any,
    pageNumber: Number | any,
    pageSize: Number | any,
    sortBy: String | any,
    sortDirection: String | any
  ) {
    let searchValue: any = {};
    if (searchNameTerm) {
      searchValue.name = { $regex: searchNameTerm, $options: "i" };
    }
    let sortField = sortBy ? sortBy : "createdAt";
    let pN = pageNumber ? pageNumber : 1;
    let pS = pageSize ? pageSize : 10;
    let totalCount = await blogsCollection.count(searchValue);
    const blogs = await blogsCollection
      .find(searchValue)
      .sort({ [sortField]: sortDirection === "asc" ? 1 : -1 })
      .skip((pN - 1) * pS)
      .limit(pS)
      .toArray();
    const items = blogs.map((b) => ({
      id: b._id,
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl,
      createdAt: b.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items: [...items],
    };
  },

  async findBlog(id: string): Promise<BlogViewType | null> {
    let blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
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
  },
  async findPostsById(
    blogId: string,
    pageNumber: Number | any,
    pageSize: Number | any,
    sortBy: String | any,
    sortDirection: String | any
  ) {
    let sortField = sortBy ? sortBy : "createdAt";
    let pN = pageNumber ? pageNumber : 1;
    let pS = pageSize ? pageSize : 10;
    let totalCount = await postsCollection.count({});
    let posts = await postsCollection
      .find({ blogId: blogId })
      .sort({ [sortField]: sortDirection === "asc" ? 1 : -1 })
      .skip((pN - 1) * pS)
      .limit(pS)
      .toArray();
    const items = posts.map((p) => ({
      id: p._id,
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
    }));
    return {
      pagesCount: Math.ceil(totalCount / pS),
      page: pN,
      pageSize: pS,
      totalCount: totalCount,
      items: [...items],
    };
  },
};
