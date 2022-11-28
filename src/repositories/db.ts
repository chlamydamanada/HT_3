import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;
//"mongodb+srv://admin:12345@cluster0.dzu1h8j.mongodb.net/?retryWrites=true&w=majority";
//process.env.MONGO_URL;
console.log("url:", mongoUrl);
if (!mongoUrl) {
  throw new Error("mongoUrl doesn't found");
}
const client = new MongoClient(mongoUrl);

const myDb = client.db("ht");
export const blogsCollection = myDb.collection("blogs");
export const postsCollection = myDb.collection("posts");

export async function runDb() {
  try {
    await client.connect();
    await client.db("ht").command({ ping: 1 });
    console.log("Connected successfully to mongo server");
  } catch {
    console.log("Can't connect to mongo server");
    await client.close();
  }
}
