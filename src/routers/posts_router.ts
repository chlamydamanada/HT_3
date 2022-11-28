import { NextFunction, Request, Response, Router } from "express";
import { postsRepository } from "../repositories/posts_db_repository";
import { body, ValidationError, validationResult } from "express-validator";
import { basAuthMiddleware } from "./blogs_router";
import { blogsRepository } from "../repositories/blogs_db_repository";

export const postsRouter = Router();

const blogIdValidation = body("blogId")
  .isString()
  .custom((blogId) => {
    const findBlogWithId = blogsRepository.findBlog(blogId);
    if (!findBlogWithId) {
      throw new Error("blog with this id does not exist in the DB");
    } else {
      return true;
    }
  });
const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("title is not correct");
const shortDesValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("shortDescription is not correct");
const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("content is not correct");
const inputValMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorFormatter = ({
    location,
    msg,
    param,
    value,
    nestedErrors,
  }: ValidationError) => {
    return { message: msg, field: param };
  };
  const result = validationResult(req).formatWith(errorFormatter);
  if (!result.isEmpty()) {
    res
      .status(400)
      .json({ errorsMessages: result.array({ onlyFirstError: true }) });
  } else {
    next();
  }
};

postsRouter.get("/", async (req: Request, res: Response) => {
  const allPosts = await postsRepository.findPosts();
  res.status(200).send(allPosts);
});
postsRouter.get("/:id", async (req: Request, res: Response) => {
  let post = await postsRepository.findPost(req.params.id);
  if (post) {
    res.status(200).send(post);
  } else {
    res.sendStatus(404);
  }
});
postsRouter.delete(
  "/:id",
  basAuthMiddleware,
  async (req: Request, res: Response) => {
    let isPost = await postsRepository.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    } else {
      let isDel = await postsRepository.deletePost(req.params.id);
      res.sendStatus(204);
    }
  }
);
postsRouter.post(
  "/",
  basAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const getBlog = await blogsRepository.findBlog(req.body.blogId);
    if (getBlog) {
      const newPost = await postsRepository.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId,
        getBlog.name
      );
      res.status(201).send(newPost);
    }
  }
);
postsRouter.put(
  "/:id",
  basAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const isPost = await postsRepository.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    } else {
      const isUpD = await postsRepository.updatePost(
        req.params.id,
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.body.blogId
      );
      return res.sendStatus(204);
    }
  }
);
