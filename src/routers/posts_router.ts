import { NextFunction, Request, Response, Router } from "express";
import { body, ValidationError, validationResult } from "express-validator";
import { postsService } from "../domain/posts_service";
import { postsQwRepository } from "../repositories/posts_qwery_repo";
import { blogsQwRepository } from "../repositories/blogs_qwery_repo";
import { baseAuthMiddleware } from "../middlewares/baseAuthorization.middleware";

export const postsRouter = Router();

export const blogIdValidation = body("blogId")
  .isString()
  .custom(async (blogId) => {
    const findBlogWithId = await blogsQwRepository.findBlog(blogId);
    if (!findBlogWithId) {
      throw new Error("Blog with this id does not exist in the DB");
    }
    return true;
  });
export const titleValidation = body("title")
  .isString()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("title is not correct");
export const shortDesValidation = body("shortDescription")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("shortDescription is not correct");
export const contentValidation = body("content")
  .isString()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("content is not correct");
export const inputValMiddleware = (
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
  const posts = await postsQwRepository.findPosts(
    req.query.pageNumber,
    req.query.pageSize,
    req.query.sortBy,
    req.query.sortDirection
  );
  res.status(200).send(posts);
});
postsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  let post = await postsQwRepository.findPost(req.params.id);
  if (post) {
    res.status(200).send(post);
  } else {
    res.sendStatus(404);
  }
});
postsRouter.delete(
  "/:id",
  baseAuthMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    let isPost = await postsQwRepository.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    }
    let isDel = await postsService.deletePost(req.params.id);
    res.sendStatus(204);
  }
);
postsRouter.post(
  "/",
  baseAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const getBlog = await blogsQwRepository.findBlog(req.body.blogId);
    if (getBlog) {
      const newPost = await postsService.createPost(
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
  baseAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: Request<{ id: string }>, res: Response) => {
    const isPost = await postsQwRepository.findPost(req.params.id);
    if (!isPost) {
      res.sendStatus(404);
    } else {
      const isUpD = await postsService.updatePost(
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
