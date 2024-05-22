import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
  audience: 'this is the unique identifier',
  issuerBaseURL: 'https://dev-m2f3ppmzvnre585o.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});

export default jwtCheck;
