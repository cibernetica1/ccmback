import { APP_ID, APP_SECRET, HOST_URL, TENANT, PORT, URL_FRONTEND } from "../utils/secrets";

const passconfig = {
  creds: {
    identityMetadata: `https://login.microsoftonline.com/${TENANT}/.well-known/openid-configuration`,
    clientID: APP_ID,
    redirectUrl: `${HOST_URL}:${PORT}/ad-auth/signin`,
    clientSecret: APP_SECRET,
  },
  resourceURL: "https://graph.windows.net",
  destroySessionUrl: `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${URL_FRONTEND}`,
};
export default passconfig;
