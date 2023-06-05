/* Modules */
import { Router, Request, Response } from "express";

/* Utils */
import { URL_FRONTEND } from "../utils/secrets";

/* Controllers */
import { isLogin, login, logout, signin } from "../controllers/ad.controllers";

const router = Router();

/* AD is login */
router.get("/islogin", isLogin);

/* AD login */
router.get("/login", login, function (req: Request, res: Response) {
  res.redirect("/");
});

/* AD signin */
router.post("/signin", signin, function (req: Request, res: Response) {
  console.log("Datos de azure recibidos correctamente");
  res.redirect(URL_FRONTEND);
});

/* AD logout */
router.get("/logout", logout);

export default router;
