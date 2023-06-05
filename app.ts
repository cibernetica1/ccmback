import express from "express";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import passport from "passport";
import expressValidator from "express-validator";
import cookieParser from "cookie-parser";

/* Routes */
import authADRoutes from "./routes/auth.ad.routes";
import authJWTRoutes from "./routes/special.routes";
import specialRoutes from "./routes/special.routes";

/* Middlewares */
import sessionJWTMiddleware from "./middlewares/passport-jwt";
import sessionADMiddleware from "./middlewares/passport-ad";
import { SESSION_SECRET, URL_FRONTEND } from "./utils/secrets";

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
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(sessionADMiddleware);
passport.use(sessionJWTMiddleware);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/ad-auth", authADRoutes);
app.use("/auth", authJWTRoutes);
app.use("/api", specialRoutes);

// read static files
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

export default app;
