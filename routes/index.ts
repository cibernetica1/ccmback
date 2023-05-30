/* Modules */
import { Router } from "express";
import passport from "passport";
import passportconfig from "../config/passport";
import session from "express-session";

/* Utils */
import { SESSION_SECRET, URL_FRONTEND } from "../utils/secrets";
import { sessionMiddleware } from "../app";

const router = Router();

/* router.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);

router.use(passport.initialize());
router.use(passport.session()); */

function ensureAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

/* Healthcheck */
router.get("/healthcheck", async (req, res) => {
  const res_obj = {
    message: "healthy",
  };

  console.log("res_obj:", res_obj);

  res.json(res_obj);
});

/* AD is login */
router.get("/islogin", function (req, res, next) {
  res.send(req.isAuthenticated());
  next();
});

/* AD login */
router.get(
  "/login",
  function (req: any, res: any, next: any) {
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/fail",
    })(req, res, next);
  },
  function (req, res) {
    res.redirect("/");
  }
);

/* AD signin */
router.post(
  "/signin",
  function (req: any, res: any, next: any) {
    passport.authenticate("azuread-openidconnect", {
      failureRedirect: "/fail",
    })(req, res, next);
  },
  function (req, res) {
    console.log("Datos de azure recibidos correctamente");
    res.redirect(URL_FRONTEND);
  }
);

/* AD account */
router.get("/account", ensureAuthenticated, function (req, res) {
  res.send(req.user);
});

/* AD logout */
router.get("/logout", function (req: any, res: any) {
  req.session.destroy(() => {
    req.logOut(() => {
      res.redirect(passportconfig.destroySessionUrl);
    });
  });
});

export default router;
