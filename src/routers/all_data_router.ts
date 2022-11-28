import { Request, Response, Router } from "express";
import { allDataRepository } from "../repositories/all_data_db_repository";

export const allDataRouter = Router();

allDataRouter.delete("/", async (req: Request, res: Response) => {
  let blogDel = await allDataRepository.deleteAllBlogs();
  if (blogDel) {
    console.log("blogs are del");
  }
  let postDel = await allDataRepository.deleteAllPost();
  if (postDel) {
    console.log("posts are del");
  }
  if (blogDel && postDel) {
    res.sendStatus(204);
  }
});
