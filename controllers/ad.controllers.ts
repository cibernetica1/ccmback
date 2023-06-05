import { NextFunction, Request, Response } from "express";
import passport from "passport";
import passportconfig from "../config/passport.ad";

export const isLogin = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.send(req.isAuthenticated());
  next();
};

export const login = function (req: Request, res: Response, next: NextFunction) {
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/fail",
  })(req, res, next);
};

export const signin = function (req: Request, res: Response, next: NextFunction) {
  passport.authenticate("azuread-openidconnect", {
    failureRedirect: "/fail",
  })(req, res, next);
};

export const ensureAuthenticated = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

export const logout = function (req: Request, res: Response) {
  req.session.destroy(() => {
    req.logOut(() => {
      res.redirect(passportconfig.destroySessionUrl);
    });
  });
};
