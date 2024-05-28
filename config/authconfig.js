import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
  audience: 'https://backend-real-estate-six.vercel.app',
  issuerBaseURL: 'https://dev-m2f3ppmzvnre585o.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

export default jwtCheck;
