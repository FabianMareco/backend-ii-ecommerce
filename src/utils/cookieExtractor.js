// utils/cookieExtractor.js
export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[process.env.COOKIE_NAME];
  }
  return token;
};