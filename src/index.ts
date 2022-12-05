import express, { Request, Response } from "express";
import { blogsRouter } from "./routers/blogs_router";
import { postsRouter } from "./routers/posts_router";
import { allDataRouter } from "./routers/all_data_router";
import { parserMiddleware } from "./parserMiddleware";
import { runDb } from "./repositories/db";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/testing/all-data", allDataRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(`Hello user`);
});

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};
startApp();
