import { NextFunction, Request, Response, Router } from "express";
import {
  body,
  validationResult,
  ValidationError,
  query,
} from "express-validator";
import { blogsService } from "../domain/blogs_service";
import {
  blogIdValidation,
  contentValidation,
  shortDesValidation,
  titleValidation,
} from "./posts_router";
import { blogsQwRepository } from "../repositories/blogs_qwery_repo";
import { postsService } from "../domain/posts_service";
import { RequestWhithParams } from "../models/request_types";
import { baseAuthMiddleware } from "../middlewares/baseAuthorization.middleware";

export const blogsRouter = Router();

const nameValidation = body("name")
  .isString()
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage("name is not correct");
const descriptionValidation = body("description")
  .isString()
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("description is not correct");
const websiteValidation = body("websiteUrl")
  .isString()
  .trim()
  .isLength({ min: 1, max: 100 })
  .isURL({ protocols: ["https"] })
  .withMessage("website is not correct");
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

blogsRouter.get("/", async (req: Request, res: Response) => {
  const blogs = await blogsQwRepository.findBlogs(
    req.query.searchNameTerm,
    req.query.pageNumber,
    req.query.pageSize,
    req.query.sortBy,
    req.query.sortDirection
  );
  res.status(200).send(blogs);
});
blogsRouter.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  let blog = await blogsQwRepository.findBlog(req.params.id);
  if (!blog) {
    res.sendStatus(404);
  }
  res.status(200).send(blog);
});

blogsRouter.delete(
  "/:id",
  baseAuthMiddleware,
  async (req: RequestWhithParams<{ id: string }>, res: Response) => {
    let isBlog = await blogsQwRepository.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      let isDel = await blogsService.deleteBlog(req.params.id);
      res.sendStatus(204);
    }
  }
);
blogsRouter.post(
  "/",
  baseAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await blogsService.createBlog(
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );

    res.status(201).send(newBlog);
  }
);
blogsRouter.post(
  "/:blogId/posts/",
  baseAuthMiddleware,
  blogIdValidation,
  titleValidation,
  shortDesValidation,
  contentValidation,
  inputValMiddleware,
  async (req: Request<{ blogId: string }, {}>, res: Response) => {
    const getBlog = await blogsQwRepository.findBlog(req.params.blogId);
    if (getBlog) {
      const newPost = await postsService.createPost(
        req.body.title,
        req.body.shortDescription,
        req.body.content,
        req.params.blogId,
        getBlog.name
      );
      res.status(201).send(newPost);
    }
  }
);
blogsRouter.put(
  "/:id",
  baseAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValMiddleware,
  async (req: RequestWhithParams<{ id: string }>, res: Response) => {
    let isBlog = await blogsQwRepository.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      const isNewBlog = await blogsService.updateBlog(
        req.params.id,
        req.body.name,
        req.body.description,
        req.body.websiteUrl
      );

      res.sendStatus(204);
    }
  }
);
blogsRouter.get(
  "/:blogId/posts",
  blogIdValidation,
  async (req: Request<{ blogId: string }>, res: Response) => {
    const getBlog = await blogsQwRepository.findBlog(req.params.blogId);
    if (!getBlog) {
      res.sendStatus(404);
    } else {
      let postsByBlogId = await blogsQwRepository.findPostsById(
        req.params.blogId,
        req.query.pageNumber,
        req.query.pageSize,
        req.query.sortBy,
        req.query.sortDirection
      );
      res.status(200).send(postsByBlogId);
    }
  }
);
