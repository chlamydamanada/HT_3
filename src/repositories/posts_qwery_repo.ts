import { postsCollection } from "./db";
import { ObjectId } from "mongodb";

export const postsQwRepository = {
  async findPosts(
    pageNumber: Number | any,
    pageSize: Number | any,
    sortBy: String | any,
    sortDirection: String | any
  ) {
    let sortField = sortBy ? sortBy : "createdAt";
    let pN = pageNumber ? pageNumber : 1;
    let pS = pageSize ? pageSize : 10;
    let totalCount = await postsCollection.count({});
    const posts = await postsCollection
      .find({})
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
  async findPost(id: string) {
    let post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    };
  },
};
