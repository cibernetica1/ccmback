/* Modules */
import { Router, Request, Response } from "express";
import passport from "passport";

const router = Router();

/* Controllers */
import { special } from "../controllers/special.controller";
import { ensureAuthenticated } from "../controllers/ad.controllers";

/* Healthcheck */
router.get("/healthcheck", async (req: Request, res: Response) => {
  const res_obj = {
    message: "healthy",
  };

  console.log("res_obj:", res_obj);

  res.json(res_obj);
});

router.post("/user", passport.authenticate("jwt", { session: false }), special);

router.get(
  "/account",
  ensureAuthenticated,
  function (req: Request, res: Response) {
    res.send(req.user);
  }
);

export default router;
