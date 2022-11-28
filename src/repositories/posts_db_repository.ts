import { postsCollection } from "./db";

export const postsRepository = {
  async findPosts() {
    return await postsCollection
      .find({}, { projection: { _id: false } })
      .toArray();
  },
  async findPost(id: string) {
    let post = await postsCollection.findOne(
      { id: id },
      { projection: { _id: false } }
    );
    return post;
  },
  async deletePost(id: string) {
    let isDel = await postsCollection.deleteOne({ id: id });
    return isDel.deletedCount === 1;
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    const newPost = {
      id: +new Date() + "",
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
      createdAt: new Date().toISOString(),
    };
    await postsCollection.insertOne(newPost);
    return newPost;
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    const newPost = await postsCollection.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    );
    return newPost.matchedCount === 1;
  },
};
