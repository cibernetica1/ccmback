import { Request, Response } from "express";

export const special = (req: Request, res: Response) => {
  console.log("req.body special:", req.body);
  return res.json({ msg: `Hey ${req.body.email}!` });
};
