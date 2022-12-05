import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const mongoUrl: any = process.env.MONGO_URL;
const client = new MongoClient(mongoUrl);

export async function runDb() {
  try {
    await client.connect();
    await client.db("ht").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch (error) {
    console.log("Can't connect to mongo server", error);
    await client.close();
  }
}

export type BlogDbType = {
  //_id: ObjectId,
  websiteUrl: string;
  description: string;
  name: string;
  createdAt: string;
};

const myDb = client.db(process.env.DBNAME);
export const blogsCollection = myDb.collection<BlogDbType>("blogs");
export const postsCollection = myDb.collection("posts");
