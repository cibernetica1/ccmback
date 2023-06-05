/* Modules */
import passport from "passport";
import passportazure from "passport-azure-ad";

/* Config */
import passportconfig from "../config/passport.ad";

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

export default new OIDCStrategy(
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
    process.nextTick(function () {
      findByOid(profile.oid, function (err: any, user: any) {
        if (err) {
          return done(err);
        }
        if (!user) {
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    });
  }
);
