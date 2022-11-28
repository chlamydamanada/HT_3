let posts: any = [
  {
    id: "123456",
    title: "valstring",
    shortDescription: "valstring",
    content: "valstring",
    blogId: "2",
    blogName: "Nick",
    createdAt: "2022-11-24T18:05:03.224Z",
  },
];

export const postsRepository = {
  async findPosts() {
    return posts;
  },
  async findPost(id: string) {
    let post = posts.find((p: any) => p.id === id);
    return post;
  },
  async deletePost(id: string) {
    posts = posts.filter((post: any) => post.id !== id);
    return posts;
  },
  async createPost(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
  ) {
    const newPost = {
      id: new Date().toISOString(),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blogName,
    };
    posts.push(newPost);
    return newPost;
  },
  async updatePost(
    newPost: any,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ) {
    (newPost.title = title),
      (newPost.shortDescription = shortDescription),
      (newPost.content = content),
      (newPost.blogId = blogId);
    return newPost;
  },
  async deleteAllPost() {
    posts.splice(0, posts.length);
    return true;
  },
};
