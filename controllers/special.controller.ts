/* Modules */
import { Request, Response } from "express";

/* Modules */
import User from "../models/user";

export const special = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: "The User does not exists" });
  }

  return res.json({ msg: `Hey ${req.body.email}!` });
};
