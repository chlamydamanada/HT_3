import { Request } from "express";
export type RequestWhithBody<T> = Request<{}, {}, T>;
export type RequestWhithQyuery<T> = Request<{}, {}, {}, T>;
export type RequestWhithParams<T> = Request<T>;
