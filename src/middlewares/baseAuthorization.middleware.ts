import { NextFunction, Request, Response } from "express";

export const baseAuthMiddleware = (
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
