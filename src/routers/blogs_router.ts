import { NextFunction, Request, Response, Router } from "express";
import { blogsRepository } from "../repositories/blogs_db_repository";
import { body, validationResult, ValidationError } from "express-validator";

export const blogsRouter = Router();

export const basAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //let login = "admin";
  // let pass = "qwerty";
  // let b64 = btoa(`${login}:${pass}`);
  // let result = `${'Basic '}${b64}`;
  const log = "Basic YWRtaW46cXdlcnR5";
  if (req.headers.authorization !== log) {
    res.sendStatus(401);
  } else {
    next();
  }
};

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
  const allBlogs = await blogsRepository.findBlogs();
  res.status(200).send(allBlogs);
});
blogsRouter.get("/:id", async (req: Request, res: Response) => {
  let blog = await blogsRepository.findBlog(req.params.id);
  if (blog) {
    res.status(200).send(blog);
  } else {
    res.send(404);
  }
});
blogsRouter.delete(
  "/:id",
  basAuthMiddleware,
  async (req: Request, res: Response) => {
    let isBlog = await blogsRepository.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      let isDel = await blogsRepository.deleteBlog(req.params.id);
      res.sendStatus(204);
    }
  }
);
blogsRouter.post(
  "/",
  basAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    const newBlog = await blogsRepository.createBlog(
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );
    res.status(201).send(newBlog);
  }
);
blogsRouter.put(
  "/:id",
  basAuthMiddleware,
  nameValidation,
  descriptionValidation,
  websiteValidation,
  inputValMiddleware,
  async (req: Request, res: Response) => {
    let isBlog = await blogsRepository.findBlog(req.params.id);
    if (!isBlog) {
      res.sendStatus(404);
    } else {
      const isNewBlog = await blogsRepository.updateBlog(
        req.params.id,
        req.body.name,
        req.body.description,
        req.body.websiteUrl
      );
      res.sendStatus(204);
    }
  }
);
