import { blogsCollection, postsCollection } from "./db";

export const allDataRepository = {
  async deleteAllPost() {
    let isDel = await postsCollection.deleteMany({});
    return isDel.deletedCount >= 0;
  },
  async deleteAllBlogs() {
    let isDel = await blogsCollection.deleteMany({});
    return isDel.deletedCount >= 0;
  },
};
