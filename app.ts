import express, { Router } from "express";
import morgan from "morgan";
import path from "path";
import passport from "passport";
import passportazure from "passport-azure-ad";
import expressValidator from "express-validator";
import cookieParser from "cookie-parser";
import session from "express-session";

/* Config & Utils */
import { SESSION_SECRET, PORT, URL_FRONTEND } from "./utils/secrets";
import passportconfig from "./config/passport";

const OIDCStrategy = passportazure.OIDCStrategy;

passport.serializeUser(function (user: any, done: any) {
  done(null, user.oid);
});

passport.deserializeUser(function (oid: any, done: any) {
  findByOid(oid, function (err: any, user: any) {
    done(err, user);
  });
});

var users: any = [];

var findByOid = function (oid: any, fn: any) {
  for (var i = 0, len = users.length; i < len; i++) {
    var user = users[i];
    if (user.oid === oid) {
      return fn(null, user);
    }
  }
  return fn(null, null);
};

passport.use(
  new OIDCStrategy(
    {
      identityMetadata: passportconfig.creds.identityMetadata,
      clientID: passportconfig.creds.clientID,
      responseType: "code id_token",
      responseMode: "form_post",
      redirectUrl: passportconfig.creds.redirectUrl,
      allowHttpForRedirectUrl: true,
      clientSecret: passportconfig.creds.clientSecret,
      validateIssuer: true,
      isB2C: false,
      issuer: "",
      passReqToCallback: false,
      scope: "",
      loggingLevel: "error",
      nonceLifetime: 0,
      nonceMaxAmount: 5,
      useCookieInsteadOfSession: true,
      cookieEncryptionKeys: [
        { key: "12345678901234567890123456789012", iv: "123456789012" },
        { key: "abcdefghijklmnopqrstuvwxyzabcdef", iv: "abcdefghijkl" },
      ],
      //clockSkew: 0
    },
    function (
      iss: any,
      sub: any,
      profile: any,
      accessToken: any,
      refreshToken: any,
      done: any
    ) {
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }
      // asynchronous verification, for effect...
      process.nextTick(function () {
        findByOid(profile.oid, function (err: any, user: any) {
          if (err) {
            return done(err);
          }
          if (!user) {
            // "Auto-registration"
            users.push(profile);
            return done(null, profile);
          }
          return done(null, user);
        });
      });
    }
  )
);

import mainRoutes from "./routes";

const app: express.Application = express();

/* Cors */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", URL_FRONTEND);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());

export const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET,
});

app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/api", [sessionMiddleware], mainRoutes);
/* AD logout */

/* app.use("/api/logout", function (req: any, res: any, next) {
  req.session.destroy(function (err: any) {
    req.logOut((err: any) => {
      if (err) return next(err);

      res.redirect(passportconfig.destroySessionUrl);
    });
  });
}); */

// read static files
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

export default app;
